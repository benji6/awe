const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

const pluginName = "Sequencer";
const emptyRow = R.repeat(0, 16);
emptyRow[1] = 1;
const classNameFromCode = {
  0: "empty",
  1: "full"
};

module.exports = (parentDomElement, data) => {
  const sequencerContainer = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, [
    h("h2", pluginName)
  ])));

  var virtualRoot = h("div.center", [
    h("table.pattern", [
      h("tr", R.map((row) => h("td", [
        h(`div.${classNameFromCode[row]}`)
      ]), emptyRow))
    ])
  ]);

  var domRoot = sequencerContainer.appendChild(createElement(virtualRoot));
};
