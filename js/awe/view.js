const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

const aweView = createElement(h("div.awe", [
  h("div.center", [
    h("h1", "Awe")
  ])
]));

document.body.appendChild(createElement(h("div.center"))).appendChild(aweView);

module.exports = {
  destinationView: aweView
};
