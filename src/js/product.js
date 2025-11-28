import { mountHeader } from "./components/header.js";
import { mountBenefits } from "./components/benefits.js";
import { mountFooter } from "./components/footer.js";
import { getProductById } from "./product-helpers.js";
import { addToCart } from "./components/cart.js";
import { getStarsHtml } from "./components/rating-stars.js";

// URL helper 
function getProductIdFromUrl() {
  const params = new window.URLSearchParams(window.location.search);
  return params.get("id");
}

// Fallback renderer for errors
function renderNotFound(message) {
  const root = document.querySelector(".product-details-container");
  if (root) {
    root.innerHTML = `<p class="main-description">${message}</p>`;
  }
}

// Main product renderer
function renderProduct(product) {
  const titleEl = document.getElementById("data-product-title");
  const priceEl = document.getElementById("data-product-price");
  const mainImgEl = document.getElementById("data-product-main-image");
  const galleryContainer = document.getElementById("data-product-gallery");
  const shortDescEl = document.getElementById("data-product-description-short");
  const longDescEl = document.getElementById("data-product-description-long");
   const ratingStarsEl = document.getElementById("data-product-rating-stars");
  const ratingEl = document.getElementById("data-product-rating");

  if (titleEl) {
    titleEl.textContent = product.name;
  }

  if (priceEl) {
    priceEl.textContent = `${product.price} €`;
  }

  if (mainImgEl) {
    mainImgEl.src = product.imageUrl;
    mainImgEl.alt = product.name;
  }

  if (galleryContainer) {
    galleryContainer.innerHTML = "";

    const hasGallery =
      Array.isArray(product.gallery) && product.gallery.length > 0;

    const gallery = hasGallery ? product.gallery : [product.imageUrl];

    gallery.forEach((src, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "product-miniimg-placeholder";
      wrapper.innerHTML = `
        <img src="${src}" alt="${product.name} thumbnail ${index + 1}" />
      `;
      galleryContainer.appendChild(wrapper);
    });
  }

  if (shortDescEl) {
    shortDescEl.textContent =
      product.descriptionShort ||
      "This is a high-quality suitcase designed for comfortable travel.";
  }

  if (longDescEl) {
    longDescEl.textContent =
      product.descriptionLong ||
      "Add a longer, more detailed description for this product in your JSON data.";
  }

    // Stars
  if (ratingStarsEl) {
    ratingStarsEl.innerHTML = getStarsHtml(product.rating ?? 0);
  }

  if (ratingEl) {
    const ratingText =
      product.rating != null ? `${product.rating}/5` : "No rating yet";
    ratingEl.textContent = ratingText;
  }
}

// Custom dropdown helper (only IDs for root parts)
function initCustomDropdown({
  dropdownId,
  buttonId,
  labelTextId,
  menuId,
  hiddenInputId,
  options,
  initialValue,
}) {
  const dropdown = document.getElementById(dropdownId);
  const button = document.getElementById(buttonId);
  const labelText = document.getElementById(labelTextId);
  const menu = document.getElementById(menuId);
  const hiddenInput = document.getElementById(hiddenInputId);

  if (!dropdown || !button || !labelText || !menu || !hiddenInput) {
    return;
  }

  // Populate menu
  menu.innerHTML = "";
  options.forEach((opt) => {
    const li = document.createElement("li");
    li.textContent = opt.label;
    li.dataset.value = opt.value;
    menu.appendChild(li);
  });

  const defaultValue = initialValue ?? options[0]?.value ?? "";

  const defaultOption =
    options.find((o) => o.value === defaultValue) ?? options[0];

  if (defaultOption) {
    labelText.textContent = defaultOption.label;
    hiddenInput.value = defaultOption.value;
  } else {
    labelText.textContent = "Choose option";
    hiddenInput.value = "";
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;

    const value = li.dataset.value || "";
    const text = li.textContent.trim();

    labelText.textContent = text;
    hiddenInput.value = value;

    dropdown.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  });

  // Close when clicking outside
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

// small helper to nice-case labels
function toLabel(v) {
  if (!v) return "Choose option";
  const str = String(v);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Init dropdowns for this specific product
function initProductDropdowns(product) {
  setupProductDropdown("size", product.size);
  setupProductDropdown("color", product.color);
  setupProductDropdown("category", product.category);
}

// Page entrypoint
export function initProductPage() {
  mountHeader("#site-header", "product");
  mountBenefits("#site-benefits");
  mountFooter("#site-footer");

  const productId = getProductIdFromUrl();

  if (!productId) {
    console.warn("[product] Missing ?id= in URL");
    renderNotFound("Product not found (missing ID).");
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    console.warn("[product] No product found for id:", productId);
    renderNotFound("Product not found.");
    return;
  }

  renderProduct(product);
  initProductDropdowns(product);

  // Add to cart button (using ID only)
  const addToCartBtn = document.getElementById("product-add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      // If you later add a quantity input, read it here
      const quantity = 1;

      // Optionally read selected dropdown values:
      const sizeInput = document.getElementById("product-size-value");
      const colorInput = document.getElementById("product-color-value");
      const categoryInput = document.getElementById("product-category-value");

      const size = sizeInput?.value || product.size;
      const color = colorInput?.value || product.color;
      const category = categoryInput?.value || product.category;

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size,
        color,
        category,
      });
    });
  }
}

function setupProductDropdown(field, rawValue) {
  // field: "size" | "color" | "category"
  const dropdownId = `product-${field}-dropdown`;
  const buttonId = `product-${field}-button`;
  const labelTextId = `product-${field}-label-text`;
  const menuId = `product-${field}-menu`;
  const hiddenInputId = `product-${field}-value`;

  let options = [];
  let initialValue;

  if (rawValue) {
    const normalized = String(rawValue).toLowerCase();
    options = [
      {
        value: normalized,
        label: toLabel(rawValue),
      },
    ];
    initialValue = normalized;
  }

  initCustomDropdown({
    dropdownId,
    buttonId,
    labelTextId,
    menuId,
    hiddenInputId,
    options,
    initialValue,
  });
}
