const CART_STORAGE_KEY = "catalogCart";
let cart = [];

function hasLocalStorage() {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  } catch {
    return false;
  }
}

function loadCart() {
  if (!hasLocalStorage()) {
    console.warn("[cart] localStorage not available, using empty cart.");
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[cart] Failed to read localStorage:", e);
    return [];
  }
}

function saveCart() {
  if (!hasLocalStorage()) return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("[cart] Failed to write localStorage:", e);
  }
}

export function addToCart({ id, name, price, quantity = 1 }) {
  if (!id) return;

  cart = loadCart();

  const numericPrice = Number(price) || 0;
  const safeName = name || "Unknown product";

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name: safeName, price: numericPrice, quantity });
  }

  saveCart();
  updateCartCounter();
}

export function clearCart() {
  cart = [];
  saveCart();
  updateCartCounter();
}

function updateCartCounter() {
  cart = loadCart();
  const counterEl = document.querySelector("[data-cart-count]");
  if (!counterEl) return;

  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  counterEl.textContent = count;
  counterEl.hidden = count <= 0;
}

export function initCart() {
  cart = loadCart();
  updateCartCounter();

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".catalog-card-cta");
    if (!button) return;
    addToCartFromButton(button);
  });
}

function addToCartFromButton(button) {
  cart = loadCart();

  const id = button.dataset.productId;
  if (!id) return;

  const name = button.dataset.productName || "Unknown product";
  const price = Number(button.dataset.productPrice || 0);

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart();
  updateCartCounter();
}

export function getCartItems() {
  cart = loadCart();
  return [...cart];
}

export function removeCartItem(id) {
  cart = loadCart().filter((item) => item.id !== id);
  saveCart();
  updateCartCounter();
}

export function changeCartItemQuantity(id, delta) {
  cart = loadCart();

  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;

  // If quantity <= 0, remove item from cart
  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  saveCart();
  updateCartCounter();
}

export function calculateCartSummary(items) {
  // Always work with a safe array
  const list = Array.isArray(items) ? items : [];

  const subtotal = list.reduce((sum, rawItem) => {
    const price = Number(rawItem?.price);
    const qty = Number(rawItem?.quantity);

    const safePrice = Number.isFinite(price) ? price : 0;
    const safeQty = Number.isFinite(qty) ? qty : 0;

    return sum + safePrice * safeQty;
  }, 0);

  // 10% discount when subtotal exceeds 3000
  const discountRate = subtotal > 3000 ? 0.1 : 0;
  const discount = subtotal * discountRate;

  // Shipping: 30 until subtotal reaches 3000, then free (and 0 when subtotal is 0)
let shipping = 0;

if (subtotal > 0 && subtotal < 3000) {
  shipping = 30;
}

  const total = subtotal - discount + shipping;

  return {
    subtotal,
    discountRate,
    discount,
    shipping,
    total,
  };
}
