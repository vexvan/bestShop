import { EMAIL_REGEX } from "./login-modal.js";

export function initFeedbackForm({
  formSelector = "#feedback-form",
  statusSelector = "[data-feedback-status]",
} = {}) {
  const form = document.querySelector(formSelector);
  if (!form) {
    console.warn(`[initFeedbackForm] Form not found for '${formSelector}'`);
    return;
  }

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const topicInput = form.querySelector("#topic");
  const messageInput = form.querySelector("#message");
  const statusEl = form.querySelector(statusSelector);

  const requiredFields = [nameInput, emailInput, topicInput, messageInput].filter(
    Boolean
  );

  function setStatus(message, type = "info") {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-error", "is-success");
    if (type === "error") statusEl.classList.add("is-error");
    if (type === "success") statusEl.classList.add("is-success");
  }

  function validateField(input) {
    if (!input) return true;

    input.setCustomValidity("");
    const value = input.value.trim();

    if (!value) {
      input.setCustomValidity("This field is required.");
      input.reportValidity();
      return false;
    }

    if (input === emailInput && !EMAIL_REGEX.test(value)) {
      input.setCustomValidity("Please enter a valid email address.");
      input.reportValidity();
      return false;
    }

    return true;
  }

  // Real-time email validation
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const value = emailInput.value.trim();
      emailInput.setCustomValidity("");

      if (!value) return; // let required validation handle empty

      if (!EMAIL_REGEX.test(value)) {
        emailInput.setCustomValidity("Please enter a valid email address.");
      }

      emailInput.reportValidity();
    });
  }

  // Validate on blur
  requiredFields.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value.trim() !== "") validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    setStatus("");

    let hasError = false;
    requiredFields.forEach((input) => {
      const ok = validateField(input);
      if (!ok && !hasError) hasError = true;
    });

    if (hasError) {
      setStatus("Please fix the errors above and try again.", "error");
      return;
    }

    setStatus("Thank you! Your feedback has been sent.", "success");
    form.reset();
  });
}
