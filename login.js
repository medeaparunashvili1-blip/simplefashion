let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCount = document.getElementById('cartCount');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const cartBtn = document.getElementById('cartBtn');

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function clearError(element) {
  element.textContent = '';
  element.style.display = 'none';
}

emailInput.addEventListener('input', () => {
  clearError(emailError);
});

passwordInput.addEventListener('input', () => {
  clearError(passwordError);
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;

  clearError(emailError);
  clearError(passwordError);

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    showError(emailError, 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError(emailError, 'Please enter a valid email address');
    isValid = false;
  }

  if (!password) {
    showError(passwordError, 'Password is required');
    isValid = false;
  } else if (!validatePassword(password)) {
    showError(passwordError, 'Password must be at least 6 characters long');
    isValid = false;
  }

  if (isValid) {
    localStorage.setItem('user', JSON.stringify({ email }));
    alert('Login successful!');
    window.location.href = '/';
  }
});

cartBtn.addEventListener('click', () => {
  window.location.href = '/';
});

updateCartCount();
