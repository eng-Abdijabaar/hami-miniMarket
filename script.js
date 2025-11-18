// Product Data
import { products } from './data/data.js';



// Cart Module
const CartModule = (() => {
    let cart = [];
    const TAX_RATE = 0.05; // 5% tax
    const DISCOUNT_THRESHOLD = 50; // $50 threshold for discount
    const DISCOUNT_RATE = 0.10; // 10% discount

    // Load cart from localStorage
    const loadCart = () => {
        const savedCart = localStorage.getItem('hamiCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        updateCartCount();
    };

    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('hamiCart', JSON.stringify(cart));
        updateCartCount();
    };

    // Add item to cart
    const addItem = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }


        saveCart();
        showToast(`${product.name} added to cart!`);
    };

    // Remove item from cart
    const removeItem = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                removeItem(productId);
            } else {
                item.quantity = quantity;
                saveCart();
            }
        }
    };

    // Get cart items
    const getItems = () => {
        return [...cart];
    };

    // Get cart total
    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Get cart count
    const getCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // Calculate tax
    const calculateTax = (amount) => {
        return amount * TAX_RATE;
    };

    // Calculate discount
    const calculateDiscount = (amount) => {
        return amount >= DISCOUNT_THRESHOLD ? amount * DISCOUNT_RATE : 0;
    };

    // Calculate final total
    const calculateFinalTotal = () => {
        const subtotal = getTotal();
        const tax = calculateTax(subtotal);
        const discount = calculateDiscount(subtotal);
        return subtotal + tax - discount;
    };

    // Clear cart
    const clearCart = () => {
        cart = [];
        saveCart();
    };

    // Update cart count in UI
    const updateCartCount = () => {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = getCount();
        }
    };

    // Show toast notification
    const showToast = (message) => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    // Initialize
    loadCart();

    return {
        addItem,
        removeItem,
        updateQuantity,
        getItems,
        getTotal,
        getCount,
        calculateTax,
        calculateDiscount,
        calculateFinalTotal,
        clearCart,
        updateCartCount
    };
})();

// Product Module
const ProductModule = (() => {
    // Render product card
    const renderProduct = (product, container) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
                    <div class="product-image" style="background-image: url('${product.image}')"></div>
                    <div class="product-info">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;

        container.appendChild(productCard);

        // Add event listener to Add to Cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            CartModule.addItem(product);
            renderCart();
        });
    };

    // Render multiple products
    const renderProducts = (productsToDisplay, container) => {
        container.innerHTML = '';

        if (productsToDisplay.length === 0) {
            const noResults = document.getElementById('no-results');
            if (noResults) {
                noResults.classList.add('active');
            }
            return;
        }

        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.classList.remove('active');
        }

        productsToDisplay.forEach(product => {
            renderProduct(product, container);
        });
    };

    return {
        renderProduct,
        renderProducts
    };
})();

// Cart UI Module
const CartUIModule = (() => {
    // Render cart items
    const renderCart = () => {
        const cartContent = document.getElementById('cart-content');
        const cartSummary = document.getElementById('cart-summary');
        const cartItems = CartModule.getItems();

        if (cartContent) {
            cartContent.innerHTML = '';

            if (cartItems.length === 0) {
                cartContent.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            } else {
                cartItems.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                                <div class="cart-item-details">
                                    <div class="cart-item-name">${item.name}</div>
                                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                                    <div class="cart-item-controls">
                                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                        <button class="remove-item" data-id="${item.id}">Remove</button>
                                    </div>
                                </div>
                            `;
                    cartContent.appendChild(cartItem);
                });
            }
        }

        if (cartSummary) {
            const subtotal = CartModule.getTotal();
            const tax = CartModule.calculateTax(subtotal);
            const discount = CartModule.calculateDiscount(subtotal);
            const finalTotal = CartModule.calculateFinalTotal();

            cartSummary.innerHTML = `
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (5%):</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        ${discount > 0 ? `
                        <div class="summary-row" style="color: var(--accent-orange);">
                            <span>Discount (10%):</span>
                            <span>-$${discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-row summary-total">
                            <span>Total:</span>
                            <span>$${finalTotal.toFixed(2)}</span>
                        </div>
                    `;
        }

        // Add event listeners to cart controls
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const item = CartModule.getItems().find(item => item.id === productId);
                if (item) {
                    CartModule.updateQuantity(productId, item.quantity - 1);
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const item = CartModule.getItems().find(item => item.id === productId);
                if (item) {
                    CartModule.updateQuantity(productId, item.quantity + 1);
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const quantity = parseInt(e.target.value);
                if (!isNaN(quantity) && quantity > 0) {
                    CartModule.updateQuantity(productId, quantity);
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                CartModule.removeItem(productId);
                renderCart();
            });
        });
    };

    // Render order summary
    const renderOrderSummary = () => {
        const orderSummaryContent = document.getElementById('order-summary-content');
        const cartItems = CartModule.getItems();

        if (orderSummaryContent) {
            if (cartItems.length === 0) {
                orderSummaryContent.innerHTML = `
                            <div style="text-align: center; padding: 2rem;">
                                <h2>Your cart is empty</h2>
                                <p>Add some products to your cart first!</p>
                                <a href="#" class="btn nav-link" data-section="products" style="margin-top: 1rem;">Browse Products</a>
                            </div>
                        `;
            } else {
                const subtotal = CartModule.getTotal();
                const tax = CartModule.calculateTax(subtotal);
                const discount = CartModule.calculateDiscount(subtotal);
                const finalTotal = CartModule.calculateFinalTotal();

                let itemsHTML = '';
                cartItems.forEach(item => {
                    itemsHTML += `
                                <div class="order-item">
                                    <div>
                                        <h3>${item.name}</h3>
                                        <p>Quantity: ${item.quantity}</p>
                                    </div>
                                    <div>$${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            `;
                });

                orderSummaryContent.innerHTML = `
                            <div class="order-items">
                                ${itemsHTML}
                            </div>
                            <div class="order-totals">
                                <div class="order-total-row">
                                    <span>Subtotal:</span>
                                    <span>$${subtotal.toFixed(2)}</span>
                                </div>
                                <div class="order-total-row">
                                    <span>Tax (5%):</span>
                                    <span>$${tax.toFixed(2)}</span>
                                </div>
                                ${discount > 0 ? `
                                <div class="order-total-row" style="color: var(--accent-orange);">
                                    <span>Discount (10%):</span>
                                    <span>-$${discount.toFixed(2)}</span>
                                </div>
                                ` : ''}
                                <div class="order-total-row order-grand-total">
                                    <span>Total:</span>
                                    <span>$${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button class="btn" id="confirm-order" style="width: 100%; margin-top: 2rem;">Confirm Order</button>
                        `;

                // Add event listener to confirm order button
                document.getElementById('confirm-order').addEventListener('click', () => {
                    alert('Thank you for your order! Your items will be prepared for pickup.');
                    CartModule.clearCart();
                    renderCart();
                    showSection('home');
                });
            }
        }
    };

    return {
        renderCart,
        renderOrderSummary
    };
})();

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const featuredProducts = document.getElementById('featured-products');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category');
const priceFilter = document.getElementById('price');
const priceValue = document.getElementById('price-value');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkout-btn');
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const backToTopButton = document.querySelector('.back-to-top');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Render products
    ProductModule.renderProducts(products, productsGrid);

    // Render featured products
    const featured = products.slice(0, 4);
    ProductModule.renderProducts(featured, featuredProducts);

    // Render cart
    CartUIModule.renderCart();

    // Event listeners for filters
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('input', () => {
        priceValue.textContent = priceFilter.value;
        filterProducts();
    });

    // Cart sidebar
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        closeCartSidebar();
        showSection('order-summary');
        CartUIModule.renderOrderSummary();
    });

    // Navigation
    setupNavigation();

    // Back to top button
    setupBackToTop();
});

// Filter products based on search and filter criteria
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const maxPrice = parseFloat(priceFilter.value);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    ProductModule.renderProducts(filteredProducts, productsGrid);
}

// Open cart sidebar
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Setup navigation between sections
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            showSection(targetSection);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Update active nav link
    navLinks.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');

    // Show target section
    pageSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Setup back to top button
function setupBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        let isValid = true;

        // Name validation
        if (name.value.trim() === '') {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Message validation
        if (message.value.trim() === '') {
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }

        if (isValid) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        }
    });
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});