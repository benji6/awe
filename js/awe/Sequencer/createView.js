const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');
const createMenuVirtualRoot = require('./Menu/createVirtualRoot.js');
const rowsToNotes = require('./rowsToNotes.js');

const pluginName = "Sequencer";

module.exports = (model, controller, parentDomElement) => {
  var virtualRoot = h("div.center");
  const domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const render = () => {
    const data = model.getViewData();

    const newVirtualRoot = h(`div.${pluginName}`, [
      h("h2", pluginName),
      createMenuVirtualRoot(),
      h("div.center", [
        h("table.pattern", R.concat([h("tr", R.map((element) =>
          h("td", element && String(element)), R.range(0, R.length(data) + 2)))],
        R.mapIndexed((row, rowIndex) =>
          h("tr", R.concat([h("div", h("td", rowsToNotes[rowIndex]))], R.mapIndexed((td, columnIndex) =>
            h("td", h(`div.${model.getClassNameFromCode(td)}`, {
              onclick: () => controller.patternClick(rowIndex, columnIndex)
            })), row))),
            data)))
      ])
    ]);
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    domRoot,
    render
  };
};
