function getTravelCard(props = {}) {
  const {
    imageUrl = "/src/assets/img-suitcases/travellg01.png",
    alt = "Travel suitcase",
    title = "Duis vestibulum elit vel neque.",
    description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  } = props;

  // Basic escaping for alt do not break HTML
  const safeAlt = String(alt).replace(/"/g, "&quot;");
  const safeTitle = String(title);
  const safeDescription = String(description);

  return `
<article class="travel-card-container">
  <img src="${imageUrl}" alt="${safeAlt}" class="travel-card-image" />
  <div class="travel-card-overlay">
    <div class="travel-card-body">
      <h4 class="travel-card-title">${safeTitle}</h4>
      <p class="travel-card-description">${safeDescription}</p>
    </div>
  </div>
</article>`;
}

// Mount many
export function mountTravelCards(selector, items = [], defaults = {}) {

let nodes = [];

if (typeof selector === "string") {
  nodes = document.querySelectorAll(selector);
} else if (selector) {
  nodes = [selector];
}

  if (!nodes || nodes.length === 0) {
    console.warn(
      `[mountTravelCards] No elements found for selector/target: '${selector}'`
    );
    return;
  }

  const list = Array.isArray(items) ? items : [items];

  nodes.forEach((el, i) => {
    const data = { ...defaults, ...(list[i] || {}) };
    el.innerHTML = getTravelCard(data);
  });

  if (nodes.length > list.length) {
    console.warn(
      `[mountTravelCards] Only ${list.length} items provided for ${nodes.length} target nodes. Remaining nodes used defaults only.`
    );
  }
}
