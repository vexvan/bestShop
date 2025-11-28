import { mountHeader } from "./components/header.js";
import { mountHeroTitle } from "./components/hero-title.js";
import {
  getCartItems,
  removeCartItem,
  changeCartItemQuantity,
  clearCart,
  calculateCartSummary,
} from "./components/cart.js";
import { mountBenefits } from "./components/benefits.js";
import { mountFooter } from "./components/footer.js";

const pageData = {
  title: "My Cart",
  img: "/src/assets/img/cart-hero.png",
};

function initHeader() {
  mountHeader("#site-header", "cart");
}

function initHeroTitle() {
  mountHeroTitle("#hero-section", pageData);
}

function initBenefits() {
  mountBenefits("#site-benefits");
}

function initFooter() {
  mountFooter("#site-footer");
}

function renderCartTable() {
  const tableBody = document.getElementById("data-cart-table-body");
  const emptyState = document.getElementById("data-cart-empty");

  if (!tableBody) {
    console.warn("[cart-page] Missing #data-cart-table-body element");
    return;
  }

  const items = getCartItems();

  if (!items.length) {
    tableBody.innerHTML = "";
    if (emptyState) emptyState.hidden = false;

    // reset summary if cart empty
    updateCartSummary([]);
    return;
  }

  if (emptyState) emptyState.hidden = true;

  tableBody.innerHTML = items
    .map(
      (item) => `
        <div class="cart-row" data-item-id="${item.id}">
          <div class="cart-cell cart-cell-image">
            <img src="/src/assets/img/products/${item.id}.jpg" alt="${
        item.name
      }">
          </div>

          <div class="cart-cell cart-cell-name">
            ${item.name}
          </div>

          <div class="cart-cell cart-cell-price">
            $${Number(item.price).toFixed(2)}
          </div>

          <div class="cart-cell cart-cell-qty">
            <button
              type="button"
              class="cart-qty-btn cart-qty-btn-dec"
              data-qty-change="-1"
              data-item-id="${item.id}"
              aria-label="Decrease quantity for ${item.name}"
            >
              −
            </button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button
              type="button"
              class="cart-qty-btn cart-qty-btn-inc"
              data-qty-change="1"
              data-item-id="${item.id}"
              aria-label="Increase quantity for ${item.name}"
            >
              +
            </button>
          </div>

          <div class="cart-cell cart-cell-total">
            $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
          </div>

          <div class="cart-cell cart-cell-delete">
            <button
              type="button"
              class="cart-delete-btn"
              data-remove-id="${item.id}"
              aria-label="Remove ${item.name} from cart"
            >
              <img
                src="/src/assets/img/delete-icon.svg"
                alt=""
                aria-hidden="true"
                class="cart-delete-icon"
              >
            </button>
          </div>
        </div>
      `
    )
    .join("");

  updateCartSummary(items);
}

function updateCartSummary(items) {
  const subtotalEl = document.getElementById("data-cart-subtotal");
  const shippingEl = document.getElementById("data-cart-shipping");
  const totalEl = document.getElementById("data-cart-total");
  const discountRowEl = document.getElementById("data-cart-discount-row");
  const discountEl = document.getElementById("data-cart-discount");

  if (!subtotalEl || !shippingEl || !totalEl) return;

  const { subtotal, discount, shipping, total } = calculateCartSummary(items);

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (discountRowEl && discountEl) {
    if (discount > 0) {
      discountRowEl.hidden = false;
      discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRowEl.hidden = true;
      discountEl.textContent = "-$0.00";
    }
  }

  shippingEl.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;

  totalEl.textContent = `$${total.toFixed(2)}`;
}

function initCartTableInteractions() {
  const tableBody = document.getElementById("data-cart-table-body");
  if (!tableBody) return;

  tableBody.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest("[data-qty-change]");
    if (qtyBtn) {
      const id = qtyBtn.dataset.itemId;
      const delta = Number(qtyBtn.dataset.qtyChange || 0);

      changeCartItemQuantity(id, delta);
      renderCartTable();
      return;
    }

    // Remove item
    const removeBtn = event.target.closest("[data-remove-id]");
    if (removeBtn) {
      const id = removeBtn.dataset.removeId;
      removeCartItem(id);
      renderCartTable();
    }
  });
}

function showCheckoutMessage(text) {
  const msgEl = document.getElementById("data-cart-message");
  if (msgEl) {
    msgEl.textContent = text;
    msgEl.hidden = false;
  }
}

function initCartPageActions() {
  const continueBtn = document.getElementById("data-cart-continue");
  const clearBtn = document.getElementById("data-cart-clear");
  const checkoutBtn = document.getElementById("data-cart-checkout");

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "/src/html/catalog.html";
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      renderCartTable();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const items = getCartItems();

      if (!items.length) {
        showCheckoutMessage("Empty cart. No item(s) to proceed...");
        return;
      }

      clearCart();
      renderCartTable();
      showCheckoutMessage("Thank you for your purchase!");
    });
  }
}

// Page entrypoint
export function initCartPage() {
  initHeader();
  initHeroTitle();
  renderCartTable();
  initCartTableInteractions();
  initCartPageActions();
  initBenefits();
  initFooter();
}
