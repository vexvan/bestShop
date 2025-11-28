function heroTitle(data = {}) {
  const {
    title = "",
    img = "",
    description = "",
  } = data;

  const imageMarkup = img
    ? `<img
        src="${img}"
        alt="${title}"
        class="hero-image"
      />`
    : "";

  const descriptionMarkup = description
    ? `<p class="main-description">
         ${description}
       </p>`
    : "";

  return `
    <div class="hero-title">
      ${imageMarkup}
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-text">${title}</h1>
        ${descriptionMarkup}
      </div>
    </div>`;
}

export function mountHeroTitle(selector, data) {
  const container = document.querySelector(selector);
  if (!container) {
    console.warn(
      `[mountHeroTitle] Container not found for selector: '${selector}'`
    );
    return;
  }
  container.innerHTML = heroTitle(data);
}
