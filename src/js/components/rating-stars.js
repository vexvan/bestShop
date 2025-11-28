const TOTAL_STARS = 5;

const FULL_STAR_IMG =
  '<img src="/src/assets/img/ctstar.svg" alt="" aria-hidden="true">';
const EMPTY_STAR_IMG =
  '<img src="/src/assets/img/ctstarempty.svg" alt="" aria-hidden="true">';

// Normalise rating input
export function normaliseRating(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  if (num < 0) return 0;
  if (num > TOTAL_STARS) return TOTAL_STARS;
  return num;
}

export function getStarsHtml(rawRating) {
  const rating = normaliseRating(rawRating);
  const fullStars = rating >= 4.5 ? TOTAL_STARS : Math.floor(rating);

  let stars = "";
  for (let i = 0; i < TOTAL_STARS; i++) {
    stars += i < fullStars ? FULL_STAR_IMG : EMPTY_STAR_IMG;
  }

  return `<span aria-hidden="true">${stars}</span>`;
}
