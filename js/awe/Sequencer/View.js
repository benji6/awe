const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

const pluginName = "Sequencer";
const classNameFromCode = {
  0: "empty",
  1: "full"
};

module.exports = (parentDomElement, data) => {
  const sequencerContainer = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, [
    h("h2", pluginName)
  ])));

  var virtualRoot = h("div.center", [
    h("table.pattern", R.map(
      (row) => h("tr", R.map((td) => h("td", [
        h(`div.${classNameFromCode[td]}`)
      ]), row)),
    data))
  ]);

  var domRoot = sequencerContainer.appendChild(createElement(virtualRoot));
};
