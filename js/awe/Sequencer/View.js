const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

const pluginName = "Sequencer";
const classNameFromCode = [
  "empty",
  "full",
  "emptyActive",
  "fullActive"
];

module.exports = (parentDomElement) => {
  const sequencerContainer = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, [
    h("h2", pluginName)
  ])));

  var virtualRoot = h("div.center");
  const domRoot = sequencerContainer.appendChild(createElement(virtualRoot));

  const render = (data) => {
    const newVirtualRoot = h("div.center", [
      h("table.pattern", R.map(
        (row) => h("tr", R.map((td) => h("td", [
          h(`div.${classNameFromCode[td]}`)
        ]), row)),
      data))
    ]);
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    render
  };
};
