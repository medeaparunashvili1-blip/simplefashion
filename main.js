let allProducts = [];
let currentFilter = 'All';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

async function loadProducts() {
  try {
    const response = await fetch('/products.json');
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    productsGrid.innerHTML = '<div class="loading">Error loading products</div>';
  }
}

function displayProducts(products) {
  if (products.length === 0) {
    productsGrid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }

  productsGrid.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

function filterProducts(category) {
  currentFilter = category;

  filterBtns.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });

  if (category === 'All') {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter((p) => p.category === category);
    displayProducts(filtered);
  }
}

window.addToCart = function(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();

  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Added!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1000);
};

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotal.textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-actions">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterProducts(btn.dataset.category);
  });
});

cartBtn.addEventListener('click', () => {
  cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
  cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('active');
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = '/checkout.html';
});

loadProducts();
updateCartUI();
