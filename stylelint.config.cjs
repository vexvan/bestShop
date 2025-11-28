/** @type {import('stylelint').Config} */
module.exports = {
  // SCSS-friendly standard config
  extends: ["stylelint-config-standard-scss"],

  rules: {
    "block-no-empty": true,
    "scss/double-slash-comment-inline": [
      "never",
      {
        ignore: ["stylelint-commands"],
      },
    ],
  },
};
