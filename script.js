
        // Product Data
        const products = [
            {
                id: 1,
                name: "Fresh Apples",
                category: "fruits",
                price: 3.99,
                image: "/assets/p1.jpeg",
                description: "Crisp and juicy apples, perfect for snacking or baking."
            },
            {
                id: 2,
                name: "Organic Tomatoes",
                category: "vegetables",
                price: 4.50,
                image: "/assets/p5.avif",
                description: "Vine-ripened organic tomatoes with rich flavor."
            },
            {
                id: 3,
                name: "Leafy Greens",
                category: "vegetables",
                price: 2.99,
                image: "/assets/p2.avif",
                description: "Fresh spinach, kale, and lettuce for your salads."
            },
            {
                id: 4,
                name: "Seasonal Berries",
                category: "fruits",
                price: 6.99,
                image: "/assets/p3.jpeg",
                description: "Sweet and tangy berries packed with antioxidants."
            },
            {
                id: 5,
                name: "Fresh Carrots",
                category: "vegetables",
                price: 2.49,
                image: "/assets/p4.jpeg",
                description: "Sweet and crunchy carrots, perfect for cooking or snacking."
            },
            {
                id: 6,
                name: "Citrus Fruits",
                category: "fruits",
                price: 5.25,
                image: "/assets/Citrus Fruits.jpg",
                description: "Vitamin C rich oranges, lemons, and grapefruits."
            },
            {
                id: 7,
                name: "Avocados",
                category: "fruits",
                price: 4.75,
                image: "/assets/avo.avif",
                description: "Creamy avocados, perfect for guacamole or toast."
            },
            {
                id: 8,
                name: "Bell Peppers",
                category: "vegetables",
                price: 3.25,
                image: "/assets/well peppers.jpg",
                description: "Colorful bell peppers, great for stir-fries and salads."
            }
        ];

        // DOM Elements
        const productsGrid = document.getElementById('products-grid');
        const featuredProducts = document.getElementById('featured-products');
        const noResults = document.getElementById('no-results');
        const searchInput = document.getElementById('search');
        const categoryFilter = document.getElementById('category');
        const priceFilter = document.getElementById('price');
        const priceValue = document.getElementById('price-value');
        const cartCount = document.querySelector('.cart-count');
        const navLinks = document.querySelectorAll('.nav-link');
        const pageSections = document.querySelectorAll('.page-section');
        const backToTopButton = document.querySelector('.back-to-top');

        // Cart functionality
        let cart = [];

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            displayProducts(products, productsGrid);
            displayFeaturedProducts();
            updateCartCount();
            
            // Event listeners for filters
            searchInput.addEventListener('input', filterProducts);
            categoryFilter.addEventListener('change', filterProducts);
            priceFilter.addEventListener('input', () => {
                priceValue.textContent = priceFilter.value;
                filterProducts();
            });

            // Navigation
            setupNavigation();

            // Back to top button
            setupBackToTop();
        });

        // Display products in the grid
        function displayProducts(productsToDisplay, container) {
            container.innerHTML = '';
            
            if (productsToDisplay.length === 0) {
                noResults.classList.add('active');
                return;
            }
            
            noResults.classList.remove('active');
            
            productsToDisplay.forEach(product => {
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
            });
            
            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        }

        // Display featured products on home page
        function displayFeaturedProducts() {
            const featured = products.slice(0, 4); // Show first 4 products as featured
            displayProducts(featured, featuredProducts);
        }

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
            
            displayProducts(filteredProducts, productsGrid);
        }

        // Add product to cart
        function addToCart(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCartCount();
            
            // Visual feedback
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = 'var(--accent-orange)';
            
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
                e.target.style.backgroundColor = 'var(--primary-green)';
            }, 1000);
        }

        // Update cart count in the header
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Setup navigation between sections
        function setupNavigation() {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSection = link.getAttribute('data-section');
                    
                    // Update active nav link
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Show target section
                    pageSections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === targetSection) {
                            section.classList.add('active');
                        }
                    });
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768) {
                        nav.classList.remove('active');
                    }
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                });
            });
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
            contactForm.addEventListener('submit', function(e) {
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