const h = require('virtual-dom/h');

module.exports = () => h("nav", h("ul", h("li", [
  "Menu",
  h("ul", [
    h("li", "Nothing here yet!"),
  ])
])));
