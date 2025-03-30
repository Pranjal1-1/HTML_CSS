document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    const cartContainer = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout-btn");

    function updateCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
            totalDisplay.textContent = "0";
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            const itemTotal = item.price * item.quantity;
            cartItem.innerHTML = `
                <p><b>${item.name}</b></p>
                <div class="quantity-box">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span class="cart-quantity" data-id="${item.id}">${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <p class="item-price">Rs. ${itemTotal}</p>
                <button class="remove-item" data-id="${item.id}">X</button>
            `;
            cartContainer.appendChild(cartItem);
            total += itemTotal;
        });

        totalDisplay.textContent = `${total}`;
        attachQuantityEvents();
        attachRemoveEvents();
    }
    function resetMenuQuantities() {
        document.querySelectorAll(".menu-quantity").forEach(span => {
            span.textContent = "0";
        });
    
        document.querySelectorAll(".cart-buttons").forEach(cartButtons => {
            cartButtons.innerHTML = `<button class="add-to-cart">Add to Cart</button>`;
        });
    
        document.querySelectorAll(".add-to-cart").forEach(button => {
            const itemId = button.closest(".menu-item").getAttribute("data-id");
            attachAddToCartEvent(button, itemId);
        });
    }
    
    function attachQuantityEvents() {
        document.querySelectorAll(".decrease").forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll(".increase").forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-id");
                const itemIndex = cart.findIndex(item => item.id === itemId);
                if (itemIndex !== -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1);
                        restoreAddToCartButton(itemId);
                    }
                    updateCart();
                    updateMenuQuantity(itemId);
                }
            });
        });

        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-id");
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    item.quantity++;
                    updateCart();
                    updateMenuQuantity(itemId);
                }
            });
        });
    }

    function attachRemoveEvents() {
        document.querySelectorAll(".remove-item").forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-id");
                const item = cart.find(i => i.id === itemId);

                if (item && confirm(`Are you sure you want to remove "${item.name}" from the cart?`)) {
                    cart = cart.filter(i => i.id !== itemId);
                    restoreAddToCartButton(itemId);
                    updateCart();
                }
            });
        });
    }

    function restoreAddToCartButton(itemId) {
        const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (menuItem) {
            const cartButtons = menuItem.querySelector(".cart-buttons");
            cartButtons.innerHTML = `<button class="add-to-cart">Add to Cart</button>`;
            attachAddToCartEvent(cartButtons.querySelector(".add-to-cart"), itemId);
        }
    }

    function attachAddToCartEvent(button, itemId) {
        button.addEventListener("click", function () {
            const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
            const name = menuItem.querySelector("h3").textContent;
            const priceText = menuItem.querySelector(".price").textContent.match(/\d+/);
            const price = priceText ? parseInt(priceText[0]) : 0;

            const existingItem = cart.find(item => item.id === itemId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: itemId, name, price, quantity: 1 });
                changeToQuantityButtons(itemId);
            }
            updateCart();
            updateMenuQuantity(itemId);
            showNotification(`${name} added to cart!`);
        });
    }

    function changeToQuantityButtons(itemId) {
        const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (menuItem) {
            const cartButtons = menuItem.querySelector(".cart-buttons");
            cartButtons.innerHTML = `
                <div class="quantity-box">
                    <button class="decrease" data-id="${itemId}">-</button>
                    <span class="menu-quantity" data-id="${itemId}">1</span>
                    <button class="increase" data-id="${itemId}">+</button>
                </div>
            `;
            attachQuantityEvents();
        }
    }

    function updateMenuQuantity(itemId) {
        const cartItem = cart.find(item => item.id === itemId);
        if (cartItem) {
            const menuQuantitySpan = document.querySelector(`.menu-quantity[data-id="${itemId}"]`);
            if (menuQuantitySpan) {
                menuQuantitySpan.textContent = cartItem.quantity;
            }
        }
    }

    function showNotification(message) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 500);
        }, 1500);
    }

    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before proceeding.");
            return;
        }
    
        alert("✅ Your order has been placed successfully! 🎉");
        cart = [];
        updateCart();
        resetMenuQuantities(); // <-- This resets the menu quantities
    });    

    document.querySelectorAll(".menu-item").forEach(menuItem => {
        const button = menuItem.querySelector(".add-to-cart");
        const itemId = menuItem.getAttribute("data-id");
        attachAddToCartEvent(button, itemId);
    });
});
