
// ============================================
// NAMMA CHETTINAD - FOOD MENU & DEMO ORDERING
// Frontend only - no backend or real payment
// ============================================

const foodItems = [
    {
        id: 1,
        name: "Chettinad Chicken Biryani",
        category: "Biryani",
        price: 220,
        description: "Traditional seeraga samba chicken biryani.",
        image: "images/biryani.jpg"
    },
    {
        id: 2,
        name: "Karaikudi Chicken Curry",
        category: "Non-Veg",
        price: 240,
        description: "Authentic spicy Chettinad chicken gravy.",
        image: "images/chicken-curry.jpg"
    },
    {
        id: 3,
        name: "Mutton Chukka",
        category: "Non-Veg",
        price: 290,
        description: "Tender mutton with roasted Chettinad masala.",
        image: "images/mutton-chukka.jpg"
    },
    {
        id: 4,
        name: "Ghee Roast Dosa",
        category: "Tiffin",
        price: 120,
        description: "Crispy golden dosa with fresh chutney.",
        image: "images/dosa.jpg"
    },
    {
        id: 5,
        name: "Parotta with Salna",
        category: "Tiffin",
        price: 110,
        description: "Flaky layered parotta served with salna.",
        image: "images/parotta.jpg"
    },
    {
        id: 6,
        name: "Traditional South Indian Meals",
        category: "Veg",
        price: 160,
        description: "Complete traditional Tamil Nadu meals.",
        image: "images/meals.jpg"
    },
    {
        id: 7,
        name: "Kuzhi Paniyaram",
        category: "Veg",
        price: 100,
        description: "Soft paniyaram served with spicy chutney.",
        image: "images/paniyaram.jpg"
    },
    {
        id: 8,
        name: "Rose Milk",
        category: "Drinks",
        price: 60,
        description: "Refreshing chilled traditional rose milk.",
        image: "images/rose-milk.jpg"
    }
];

let cart = [];

// ============================================
// HELPER: FIND PRODUCT
// ============================================

function getProduct(id) {
    return foodItems.find(item => item.id === Number(id));
}

// ============================================
// DISPLAY FOOD ITEMS
// ============================================

function displayFood(category = "All") {
    const foodGrid = document.getElementById("foodGrid");

    if (!foodGrid) {
        console.error("Food grid element #foodGrid was not found.");
        return;
    }

    const filteredItems = category === "All"
        ? foodItems
        : foodItems.filter(item => item.category === category);

    foodGrid.innerHTML = filteredItems.map(item => `
        <article class="food-card">
            <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
                onerror="this.onerror=null; this.style.display='none';"
            >

            <div class="food-details">
                <span class="food-category">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>

                <div class="food-bottom">
                    <span class="food-price">₹${item.price}</span>
                    <button
                        type="button"
                        class="add-btn"
                        onclick="addToCart(${item.id})"
                    >
                        + Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// ============================================
// FILTER FOOD CATEGORIES
// ============================================

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        displayFood(button.dataset.category || "All");
    });
});

// ============================================
// ADD FOOD TO CART
// ============================================

function addToCart(id) {
    const product = getProduct(id);

    if (!product) {
        alert("This food item is not available.");
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    updateCart();
}

// ============================================
// UPDATE CART
// ============================================

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutTotal = document.getElementById("checkoutTotal");

    let total = 0;
    let count = 0;

    if (!cartItems || !cartCount || !cartTotal) {
        console.error("One or more cart elements are missing.");
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map(cartItem => {
            const product = getProduct(cartItem.id);

            if (!product) return "";

            const itemTotal = product.price * cartItem.quantity;

            total += itemTotal;
            count += cartItem.quantity;

            return `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong>
                        <small>₹${product.price} each</small>
                        <strong>₹${itemTotal}</strong>
                    </div>

                    <div class="quantity-controls">
                        <button
                            type="button"
                            aria-label="Decrease ${product.name}"
                            onclick="changeQuantity(${product.id}, -1)"
                        >−</button>

                        <span>${cartItem.quantity}</span>

                        <button
                            type="button"
                            aria-label="Increase ${product.name}"
                            onclick="changeQuantity(${product.id}, 1)"
                        >+</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    cartCount.textContent = count;
    cartTotal.textContent = "₹" + total;

    if (checkoutTotal) {
        checkoutTotal.textContent = "₹" + total;
    }
}

// ============================================
// INCREASE / DECREASE QUANTITY
// ============================================

function changeQuantity(id, change) {
    const item = cart.find(product => product.id === Number(id));

    if (!item) return;

    item.quantity += Number(change);

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== Number(id));
    }

    updateCart();
}

// ============================================
// OPEN / CLOSE CART
// ============================================

function openCart() {
    document.getElementById("cartSidebar")?.classList.add("open");
    document.getElementById("cartOverlay")?.classList.add("show");
}

function closeCart() {
    document.getElementById("cartSidebar")?.classList.remove("open");
    document.getElementById("cartOverlay")?.classList.remove("show");
}

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");

    if (sidebar?.classList.contains("open")) {
        closeCart();
    } else {
        openCart();
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function toggleNavigation() {
    document.getElementById("navLinks")?.classList.toggle("show");
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navLinks")?.classList.remove("show");
    });
});

// ============================================
// CHECKOUT
// ============================================

function openCheckout() {
    if (cart.length === 0) {
        alert("Please add food items to your cart first.");
        return;
    }

    closeCart();

    const checkoutModal = document.getElementById("checkoutModal");
    checkoutModal?.classList.add("show");
}

function closeCheckout() {
    document.getElementById("checkoutModal")?.classList.remove("show");
}

// ============================================
// PLACE DEMO ORDER
// ============================================

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();

        if (!name || !/^[0-9]{10}$/.test(phone) || !address) {
            alert("Please enter a valid name, 10-digit mobile number and address.");
            return;
        }

        const orderItems = cart.map(cartItem => {
            const product = getProduct(cartItem.id);

            return {
                name: product.name,
                quantity: cartItem.quantity,
                price: product.price
            };
        });

        const total = orderItems.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const orderId = "NC" + Date.now().toString().slice(-8);

        const order = {
            orderId: orderId,
            customer: name,
            phone: phone,
            address: address,
            items: orderItems,
            total: total,
            date: new Date().toLocaleString()
        };

        // Save the demo order locally in this browser.
        try {
            const previousOrders = JSON.parse(
                localStorage.getItem("nammaOrders") || "[]"
            );

            previousOrders.push(order);

            localStorage.setItem(
                "nammaOrders",
                JSON.stringify(previousOrders)
            );
        } catch (error) {
            console.error("Could not save order in browser storage:", error);
            alert("The order could not be saved in this browser. Please check browser storage settings.");
            return;
        }

        const successMessage = document.getElementById("successMessage");

        if (successMessage) {
            successMessage.textContent =
                "Thank you, " + name +
                "! Your demo order " + orderId +
                " has been received. Total: ₹" + total;
        }

        closeCheckout();

        document.getElementById("successModal")?.classList.add("show");

        cart = [];
        updateCart();
        checkoutForm.reset();
    });
}

// ============================================
// CLOSE SUCCESS POPUP
// ============================================

function closeSuccess() {
    document.getElementById("successModal")?.classList.remove("show");
}

// ============================================
// CLOSE POPUPS WITH ESCAPE KEY
// ============================================

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
        closeSuccess();
        document.getElementById("navLinks")?.classList.remove("show");
    }
});

// ============================================
// INITIALIZE WEBSITE
// ============================================

displayFood();
updateCart();
