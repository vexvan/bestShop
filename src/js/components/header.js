export function getHeaderHtml(activePage = "home") {
  const isActive = (page) =>
    activePage === page ? "site-header-link-active" : "";
  const ariaCurrent = (page) =>
    activePage === page ? ' aria-current="page"' : "";

  return `
    <div class="site-header">
      <div class="layout-container">
        <div class="site-header-top">
          <!-- Left: social icons -->
          <div class="site-header-social">
            <a
              href="https://facebook.com"
              class="site-header-social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/src/assets/img/facebook.svg" alt="facebook" class="site-header-social-icon">
            </a>
            <a
              href="https://twitter.com"
              class="site-header-social-link"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/src/assets/img/twitter.svg" alt="twitter" class="site-header-social-icon">
            </a>
            <a
              href="https://instagram.com"
              class="site-header-social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/src/assets/img/instagram.svg" alt="instagram" class="site-header-social-icon">
            </a>
          </div>

          <!-- Center: icon+logo text -->
          <div class="site-header-logo">
            <a href="/src/html/index.html" class="logo">
              <img src="/src/assets/img/logo.svg" alt="Best Shop logo">
              <span class="logo-text">BEST SHOP</span>
            </a>
          </div>

          <!-- Right: login + cart icons -->
          <div class="site-header-actions">
<button
  type="button"
  class="site-header-icon-link js-login-trigger"
  aria-label="Open login form"
>
  <img src="/src/assets/img/user.svg" alt="Account">
</button>
<a
  href="/src/html/cart.html"
  class="site-header-icon-link site-header-cart"
  aria-label="Cart"
>
  <img src="/src/assets/img/shopping-cart.svg" alt="cart">
<span
  class="site-header-cart-count"
  data-cart-count
  aria-live="polite"
  hidden
>
  0
</span>
</a>

          </div>
        </div>

        <!-- BOTTOM ROW -->
        <div class="site-header-bottom">
          <nav class="site-header-nav">
            <ul>
              <li>
                <a
                  class="site-header-link ${isActive("home")}"
                  href="/src/html/index.html"${ariaCurrent("home")}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  class="site-header-link ${isActive("catalog")}"
                  href="/src/html/catalog.html"${ariaCurrent("catalog")}
                >
                  <span class="site-header-link-text">Catalog</span>
                  <img src="/src/assets/img/arrow.svg" alt="arrow">
                </a>
              </li>
              <li>
                <a
                  class="site-header-link ${isActive("about")}"
                  href="/src/html/about.html"${ariaCurrent("about")}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  class="site-header-link ${isActive("contact")}"
                  href="/src/html/contact.html"${ariaCurrent("contact")}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `;
}

export function mountHeader(target, activePage) {
  let container = null;

  if (typeof target === "string") {
    container = document.querySelector(target);
  } else {
    container = target || null;
  }

  if (!container) {
    console.warn(`[mountHeader] Container not found for target: '${target}'`);
    return;
  }

  container.innerHTML = getHeaderHtml(activePage);
}
