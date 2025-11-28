export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;

function createLoginModal({ containerSelector = "body" } = {}) {
  const container =
    typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector || null;

  if (!container) {
    console.warn(
      `[createLoginModal] Container not found for selector: '${containerSelector}'`
    );
    return null;
  }

  // Avoid creating it twice
  let existing = document.querySelector("#login-modal");
  if (existing) return existing;

  const modal = document.createElement("div");
  modal.id = "login-modal";
  modal.className = "login-modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="login-modal-overlay" data-login-close></div>

    <div
      class="login-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <button
        type="button"
        class="login-modal-close"
        aria-label="Close login form"
        data-login-close
      >
        ×
      </button>

      <form class="login-modal-form" novalidate>
        <div class="login-modal-field">
          <label for="login-email" class="login-modal-label">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            class="login-modal-input"
            autocomplete="email"
          />
        </div>

        <div class="login-modal-field">
          <label for="login-password" class="login-modal-label">
            Password
          </label>
          <div class="login-modal-password-wrapper">
            <input
              id="login-password"
              name="password"
              type="password"
              required
              class="login-modal-input"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="login-modal-toggle-password"
              aria-label="Show password"
              aria-pressed="false"
            >
              <img
                src="/src/assets/img/icon-eye.svg"
                alt=""
                aria-hidden="true"
                class="login-modal-toggle-password-icon"
              />
            </button>
          </div>
        </div>

        <div class="login-modal-row">
          <label class="login-modal-checkbox-label">
            <input
              type="checkbox"
              name="remember"
              class="login-modal-checkbox"
            />
            <span class="login-modal-remember-text">Remember me</span>
          </label>

          <a href="#" class="login-modal-forgot-link">
            Forgot your password?
          </a>
        </div>

        <button
          type="submit"
          class="button-pink button-pink-40 login-modal-submit"
        >
          Log In
        </button>
      </form>
    </div>
  `;

  container.appendChild(modal);
  return modal;
}

export function initLoginModal({
  triggerSelector = ".js-login-trigger",
  containerSelector = "body",
  onSuccess,
} = {}) {
  const modal = createLoginModal({ containerSelector });
  if (!modal) return;

  const triggers = document.querySelectorAll(triggerSelector);
  if (!triggers.length) {
    console.warn(
      `[initLoginModal] No triggers found for selector: '${triggerSelector}'`
    );
  }

  const overlay = modal.querySelector(".login-modal-overlay");
  const closeButtons = modal.querySelectorAll("[data-login-close]");
  const form = modal.querySelector(".login-modal-form");
  const emailInput = modal.querySelector("#login-email");
  const passwordInput = modal.querySelector("#login-password");
  const togglePasswordBtn = modal.querySelector(".login-modal-toggle-password");
  const togglePasswordIcon = modal.querySelector(
    ".login-modal-toggle-password-icon"
  );

  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (emailInput) {
      emailInput.focus();
    }
    document.addEventListener("keydown", handleKeyDown);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleKeyDown);

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  function updatePasswordToggleState() {
    if (!passwordInput || !togglePasswordBtn) return;
    const isVisible = passwordInput.type === "text";
    togglePasswordBtn.setAttribute("aria-pressed", String(isVisible));

    if (togglePasswordIcon) {
      togglePasswordIcon.src = "/src/assets/img/icon-eye.svg";
    }

    togglePasswordBtn.setAttribute(
      "aria-label",
      isVisible ? "Hide password" : "Show password"
    );
  }

  // Password show/hide
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
      updatePasswordToggleState();
    });
  }

  // Triggers (account icon)
  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close buttons + overlay
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal();
    });
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      closeModal();
    });
  }

  // Submit logic with RegEx + required password
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value.trim() || "";
      const remember = form.querySelector('input[name="remember"]')?.checked;

      // Reset custom validity
      if (emailInput) emailInput.setCustomValidity("");
      if (passwordInput) passwordInput.setCustomValidity("");

      // Email RegEx validation
      if (!EMAIL_REGEX.test(email)) {
        if (emailInput) {
          emailInput.setCustomValidity("Please enter a valid email address.");
          emailInput.reportValidity();
        }
        return;
      }

      // Password required
      if (!password) {
        if (passwordInput) {
          passwordInput.setCustomValidity("Password is required.");
          passwordInput.reportValidity();
        }
        return;
      }

      // At this point form is "valid"
      if (typeof onSuccess === "function") {
        onSuccess({ email, password, remember });
      }

      form.reset();
      // Reset password visibility when closing
      if (passwordInput) passwordInput.type = "password";
      updatePasswordToggleState();
      closeModal();
    });
  }

  return { open: openModal, close: closeModal, modal };
}
