let cart = JSON.parse(localStorage.getItem('cart')) || [];

const orderItems = document.getElementById('orderItems');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const finalTotalEl = document.getElementById('finalTotal');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrderBtn');

const SHIPPING_COST = 10.0;
const TAX_RATE = 0.08;

function calculateTotals() {
  if (cart.length === 0) {
    window.location.href = '/';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

function displayOrderSummary() {
  if (cart.length === 0) {
    orderItems.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Your cart is empty</div>';
    return;
  }

  orderItems.innerHTML = cart
    .map(
      (item) => `
    <div class="order-item">
      <div class="order-item-details">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-quantity">Quantity: ${item.quantity}</div>
      </div>
      <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `
    )
    .join('');

  const { subtotal, shipping, tax, total } = calculateTotals();

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  finalTotalEl.textContent = `$${total.toFixed(2)}`;
}

placeOrderBtn.addEventListener('click', () => {
  const form = checkoutForm;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  const orderData = {
    customer: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      zipCode: formData.get('zipCode'),
      phone: formData.get('phone'),
    },
    paymentMethod: paymentMethod,
    items: cart,
    totals: calculateTotals(),
    orderDate: new Date().toISOString(),
  };

  localStorage.setItem('lastOrder', JSON.stringify(orderData));

  localStorage.removeItem('cart');

  alert('Order placed successfully! Thank you for your purchase.');

  window.location.href = '/';
});

displayOrderSummary();
