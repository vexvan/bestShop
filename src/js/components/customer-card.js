export function getCustomerCard(props = {}) {
  const {
    imageUrl = "/src/assets/img/costumer1.png",
    alt = "",
    description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem consectetur adipisicing elit.",
    title = "Ethan Wade, New York",
  } = props;

  // Escape quotes in alt do not break HTML
  const safeAlt = String(alt).replace(/"/g, "&quot;");

  return `
<article class="costumer-card-container">
  <div class="costumer-card-media">
    <img src="${imageUrl}" alt="${safeAlt}">
  </div>
  <div class="costumer-card-body">
    <p class="costummer-card-description">${description}</p>
    <p class="costummer-card-title">${title}</p>
  </div>
</article>`;
}

// Mount many at once
export function mountCustomerCards(selector, items = [], defaults = {}) {
  // Allow passing a string selector or a single element
  let nodes = [];

  if (typeof selector === "string") {
    nodes = document.querySelectorAll(selector);
  } else if (selector) {
    nodes = [selector];
  }

  if (!nodes || nodes.length === 0) {
    console.warn(
      `[mountCustomerCards] No elements found for selector: '${selector}'`
    );
    return;
  }

  // Normalise items to an array
  const list = Array.isArray(items) ? items : [items];

  nodes.forEach((el, i) => {
    const props = { ...defaults, ...(list[i] || {}) };
    el.innerHTML = getCustomerCard(props);
  });

  // Optional: warn if you have more placeholders than data
  if (nodes.length > list.length) {
    console.warn(
      `[mountCustomerCards] Only ${list.length} items provided for ${nodes.length} target nodes. Remaining nodes used defaults only.`
    );
  }
}
