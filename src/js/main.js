import { initHomePage } from "./home";
import { initCatalogPage } from "./catalog.js";
import { initAboutPage } from "./about.js";
import { initContactPage } from "./contact.js";
import { initLoginModal } from "./components/login-modal.js";
import { initCartPage } from "./cart.js";
import { initCart } from "./components/cart.js";
import { initProductPage } from "./product.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const page = document.body.dataset.page;

    switch (page) {
      case "home":
        initHomePage();
        break;
      case "catalog":
        initCatalogPage();
        break;
      case "about":
        initAboutPage();
        break;
      case "contact":
        initContactPage();
        break;
      case "cart":
        initCartPage();
        break;
      case "product":
        initProductPage();
        break;
      default:
        console.warn("[main] Unknown or missing data-page on <body>:", page);
        break;
    }
    initCart();

    initLoginModal({
      triggerSelector: ".js-login-trigger",
      containerSelector: "body",
      onSuccess({ email, remember }) {
        console.log("Logged in as:", email, "remember:", remember);
      },
    });
  } catch (err) {
    console.error("[main] Unhandled error during app initialization:", err);
  }
});
