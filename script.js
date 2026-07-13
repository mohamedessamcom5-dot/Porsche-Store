// Cart management
let cart = [];

// Initialize cart from localStorage - single source of truth
function initCart() {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart && storedCart !== "null" && storedCart !== "undefined") {
      const parsedCart = JSON.parse(storedCart);
      // Ensure cart is a valid array
      if (Array.isArray(parsedCart) && parsedCart.length > 0) {
        // Validate cart items have required properties
        cart = parsedCart.filter(item =>
          item &&
          typeof item === 'object' &&
          item.product &&
          typeof item.product === 'string' &&
          typeof item.price === 'number' &&
          !isNaN(item.price)
        );
        // If validation removed items, save cleaned cart
        if (cart.length !== parsedCart.length) {
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      } else {
        // Empty or invalid array - reset to empty
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      // No stored cart or invalid - reset to empty
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (e) {
    console.error("Error loading cart:", e);
    // On any error, reset cart to empty
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  updateCartCount();
}

function updateCartCount() {
  // Always sync with the actual cart array
  const count = Array.isArray(cart) ? cart.length : 0;

  // Update all cart count elements on the page
  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = count;
  });
}

function addToCart(product, price) {
  // Ensure cart is initialized
  if (!Array.isArray(cart)) {
    initCart();
  }

  cart.push({ product, price: parseFloat(price) });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Show success notification
  showNotification(`${product} added to cart!`);
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function removeFromCart(index) {
  // Ensure cart is synced
  initCart();

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();

    // Show notification
    if (cart.length === 0) {
      showNotification("Cart is now empty");
    } else {
      showNotification("Item removed from cart");
    }
  }
}

function displayCart() {
  // Ensure cart is synced before displaying
  initCart();

  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const totalContainer = document.getElementById("cart-total");
  const checkoutButton = document.querySelector(".checkout-button");
  const clearButton = document.querySelector(".clear-cart-button");

  if (cartItems) {
    cartItems.innerHTML = "";
    let total = 0;

    // Check if cart is actually empty
    if (!Array.isArray(cart) || cart.length === 0) {
      cart = []; // Ensure it's an empty array
      localStorage.setItem("cart", JSON.stringify(cart));
      cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
      // Hide checkout button and total when cart is empty
      if (checkoutButton) checkoutButton.style.display = "none";
      if (clearButton) clearButton.style.display = "none";
      if (totalContainer) totalContainer.style.display = "none";
    } else {
      cart.forEach((item, index) => {
        if (item && item.product && typeof item.price === 'number') {
          total += item.price;
          cartItems.innerHTML += `
            <div class="cart-item">
              <p>${item.product} - $${item.price.toFixed(2)}</p>
              <button onclick="removeFromCart(${index})">Remove</button>
            </div>
          `;
        }
      });
      // Show checkout button and total when cart has items
      if (checkoutButton) checkoutButton.style.display = "inline-block";
      if (clearButton) clearButton.style.display = "inline-block";
      if (totalContainer) totalContainer.style.display = "block";
    }
    if (totalPrice) totalPrice.textContent = total.toFixed(2);
  }
  // Update cart count when cart is displayed
  updateCartCount();
}

function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify([]));
    updateCartCount();
    displayCart();
    showNotification("Cart cleared");
  }
}

function displayCheckout() {
  // Ensure cart is synced before displaying
  initCart();

  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  if (checkoutItems) {
    checkoutItems.innerHTML = "";
    let total = 0;

    // Check if cart is actually empty
    if (!Array.isArray(cart) || cart.length === 0) {
      cart = []; // Ensure it's an empty array
      localStorage.setItem("cart", JSON.stringify(cart));
      checkoutItems.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No items in cart</p>';
    } else {
      cart.forEach((item) => {
        if (item && item.product && typeof item.price === 'number') {
          total += item.price;
          checkoutItems.innerHTML += `<p>${item.product} - $${item.price.toFixed(2)}</p>`;
        }
      });
    }
    if (checkoutTotal) checkoutTotal.textContent = total.toFixed(2);
  }
  // Update cart count
  updateCartCount();
}

// Search functionality
const productDetails = {
  "Porsche Macan": {
    name: "Porsche Macan",
    price: 68300,
    image: "Macan.jpg",
    category: "SUV",
    description: "The Porsche Macan combines compact luxury with agile performance, delivering a sporty design and impressive daily usability.",
    specs: ["Engine: 2.0L Turbocharged", "Power: 261 hp", "0-60 mph: 6.0 sec", "Fuel Economy: 19 city / 25 highway", "Seats: 5"],
    highlights: ["Adaptive air suspension", "Panoramic roof", "Premium leather interior", "Advanced driver assistance"]
  },
  "Porsche Panamera": {
    name: "Porsche Panamera",
    price: 99900,
    image: "Panamera.JPG",
    category: "Sedan & Executive",
    description: "A powerful executive sedan with striking design, long-distance comfort, and Porsche's signature performance.",
    specs: ["Engine: 2.9L V6", "Power: 325 hp", "0-60 mph: 5.1 sec", "Fuel Economy: 18 city / 25 highway", "Seats: 5"],
    highlights: ["4D Chassis Control", "Massage seats", "Rear-axle steering", "Burmester sound system"]
  },
  "Porsche Taycan": {
    name: "Porsche Taycan",
    price: 105300,
    image: "Taycan.JPG",
    category: "Sedan & Executive",
    description: "The Taycan brings Porsche electric performance to life with instant acceleration and a modern luxury cabin.",
    specs: ["Battery: 79.2 kWh", "Power: 402 hp", "0-60 mph: 4.5 sec", "Range: Up to 300 miles", "Seats: 5"],
    highlights: ["Fast charging", "Launch Control", "Adaptive cruise control", "Premium OLED cockpit"]
  },
  "Porsche Cayenne": {
    name: "Porsche Cayenne",
    price: 92400,
    image: "Cayenne.jpg",
    category: "SUV",
    description: "A luxury SUV that offers commanding presence, excellent comfort, and thrilling driving dynamics.",
    specs: ["Engine: 3.0L V6", "Power: 348 hp", "0-60 mph: 5.9 sec", "Fuel Economy: 19 city / 23 highway", "Seats: 5"],
    highlights: ["Adaptive air suspension", "Off-road driving modes", "Panoramic roof", "Premium infotainment"]
  },
  "Porsche 718 Cayman": {
    name: "Porsche 718 Cayman",
    price: 74900,
    image: "718 Cayman.jpg",
    category: "Sports Car",
    description: "An iconic mid-engine sports car that delivers precision handling, balanced performance, and pure driving joy.",
    specs: ["Engine: 2.0L Turbo", "Power: 300 hp", "0-60 mph: 4.7 sec", "Fuel Economy: 20 city / 26 highway", "Seats: 2"],
    highlights: ["Mid-engine layout", "Sport chrono package", "Lightweight design", "Track-ready brakes"]
  },
  "Porsche 718 Boxster": {
    name: "Porsche 718 Boxster",
    price: 78500,
    image: "Boxster.jpg",
    category: "Sports Car",
    description: "The 718 Boxster is a refined open-top sports car with dramatic design and exhilarating performance.",
    specs: ["Engine: 2.0L Turbo", "Power: 300 hp", "0-60 mph: 4.8 sec", "Fuel Economy: 20 city / 26 highway", "Seats: 2"],
    highlights: ["Convertible roof", "Sport suspension", "Premium audio", "Carbon fiber trim"]
  },
  "911 GT3": {
    name: "911 GT3",
    price: 184400,
    image: "GT3.jpg",
    category: "Porsche 911",
    description: "A race-inspired Porsche 911 built for extreme precision, speed, and an unforgettable driving experience.",
    specs: ["Engine: 4.0L Flat-Six", "Power: 503 hp", "0-60 mph: 3.2 sec", "Fuel Economy: 14 city / 18 highway", "Seats: 2"],
    highlights: ["Track-focused aerodynamics", "Rear-wheel steering", "Lightweight bucket seats", "Performance exhaust"]
  },
  "911 GT3 RS": {
    name: "911 GT3 RS",
    price: 241300,
    image: "GT3 RS.JPG",
    category: "Porsche 911",
    description: "The GT3 RS pushes the limits with extraordinary aerodynamics, precision engineering, and incredible power.",
    specs: ["Engine: 4.0L Flat-Six", "Power: 518 hp", "0-60 mph: 3.2 sec", "Fuel Economy: 14 city / 18 highway", "Seats: 2"],
    highlights: ["Active aerodynamics", "Carbon ceramic brakes", "Lightweight body", "Racing-inspired cockpit"]
  },
  jacket: {
    name: "Porsche Team Jacket",
    price: 180,
    image: "jackets.jpeg",
    category: "jacket",
    description: "A premium Porsche jacket designed for comfort, style, and everyday wear with the brand's signature look.",
    specs: ["Material: Premium textile", "Fit: Regular", "Color: Black", "Care: Dry clean only", "Size: S-XXL"],
    highlights: ["Comfortable inner lining", "Porsche branding", "Weather-resistant design", "Modern streetwear style"]
  }
};

function searchProducts() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const items = document.querySelectorAll(".product-container");
  const activeCategory = document.querySelector(".category-btn.active")?.getAttribute("data-category") || "all";

  items.forEach((item) => {
    const name = item.getAttribute("data-name").toLowerCase();
    const category = item.getAttribute("data-category");
    const matchesSearch = name.includes(searchTerm);
    const matchesCategory = activeCategory === "all" || category === activeCategory;

    if (matchesSearch && matchesCategory) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Category filter functionality
function filterByCategory(category) {
  const items = document.querySelectorAll(".product-container");
  const searchTerm = document.getElementById("search-bar")?.value.toLowerCase() || "";

  items.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");
    const name = item.getAttribute("data-name").toLowerCase();
    const matchesCategory = category === "all" || itemCategory === category;
    const matchesSearch = !searchTerm || name.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  // Update active button
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-category="${category}"]`).classList.add("active");
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcons = document.querySelectorAll(".theme-toggle i");
  themeIcons.forEach(icon => {
    if (theme === "dark") {
      icon.className = "fa-solid fa-sun";
    } else {
      icon.className = "fa-solid fa-moon";
    }
  });
}

// Logo click handler - refresh and go to home
function handleLogoClick() {
  // Determine the correct home path based on current location
  const currentPath = window.location.pathname;
  let homePath = "pages/home.html";

  // If we're already on index.html or in root, go to pages/home.html
  if (currentPath.includes("index.html") || currentPath.endsWith("/") || !currentPath.includes("pages/")) {
    homePath = "pages/home.html";
  } else {
    // If we're in pages directory, just use home.html
    homePath = "home.html";
  }

  // Refresh and navigate to home
  window.location.href = homePath;
}

function renderProductDetails() {
  const container = document.getElementById("product-details");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productName = params.get("product");
  const product = productDetails[productName];

  if (!product) {
    container.innerHTML = `
      <div class="detail-empty">
        <h2>Product not found</h2>
        <p>The selected product could not be loaded.</p>
        <a href="products.html" class="detail-link-btn">Back to products</a>
      </div>
    `;
    return;
  }

  const specsHtml = product.specs.map(spec => `<li>${spec}</li>`).join("");
  const highlightsHtml = product.highlights.map(item => `<li>${item}</li>`).join("");

  container.innerHTML = `
    <div class="detail-grid">
      <div class="detail-image-wrap">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/${product.image}'" />
      </div>
      <div class="detail-info">
        <p class="detail-category">${product.category}</p>
        <h2>${product.name}</h2>
        <p class="detail-description">${product.description}</p>
        <p class="detail-price">$${product.price.toLocaleString()}</p>
        <div class="detail-actions">
          <button class="add-to-cart detail-btn" data-product="${product.name}" data-price="${product.price}">Add to Cart</button>
          <a href="products.html" class="detail-link-btn">Continue Shopping</a>
        </div>
        <div class="detail-lists">
          <div>
            <h3>Specifications</h3>
            <ul>${specsHtml}</ul>
          </div>
          <div>
            <h3>Highlights</h3>
            <ul>${highlightsHtml}</ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();

  // Initialize theme
  initTheme();

  // Initialize cart from localStorage - this will fix any corrupted data
  initCart();

  // Force update counter immediately
  updateCartCount();

  // Update cart display
  displayCart();
  displayCheckout();

  // Also update counter after a short delay to ensure DOM is ready
  setTimeout(() => {
    initCart();
    updateCartCount();
  }, 100);

  // Add to cart buttons - use event delegation for dynamically added buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      const product = e.target.getAttribute("data-product");
      const price = e.target.getAttribute("data-price");
      if (product && price) {
        addToCart(product, price);
      }
    }
  });

  // Search bar
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.addEventListener("input", searchProducts);
  }

  // Category filter buttons
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      filterByCategory(category);
    });
  });

  // Contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Message sent! We will get back to you soon.");
      contactForm.reset();
    });
  }

  // Checkout form
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Order placed successfully!");
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      window.location.href = "home.html";
    });
  }

  // Theme toggle button
  const themeToggleButtons = document.querySelectorAll(".theme-toggle");
  themeToggleButtons.forEach(button => {
    button.addEventListener("click", toggleTheme);
  });

  // Logo click handlers
  const logoSections = document.querySelectorAll(".logo-section");
  logoSections.forEach(logo => {
    logo.addEventListener("click", handleLogoClick);
  });

  // Also handle header-logo clicks directly
  const headerLogos = document.querySelectorAll(".header-logo");
  headerLogos.forEach(logo => {
    logo.addEventListener("click", handleLogoClick);
  });
});


