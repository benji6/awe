const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');
const rowsToNotes = require('./rowsToNotes.js');

const pluginName = "Sequencer";
const classNameFromCode = [
  "empty",
  "full",
  "emptyActive",
  "fullActive"
];

module.exports = (model, parentDomElement) => {
  const sequencerContainer = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, [
    h("h2", pluginName)
  ])));

  const rangeVirtualDom = h("tr", [
    h("td", "BPM"),
    h("input", {
      type: "range",
      min: 60,
      max: 300,
      onchange: function () {
        console.log(this.value);
      }
    }),
    h("output")
  ]);

  sequencerContainer.appendChild(createElement(rangeVirtualDom));

  var virtualRoot = h("div.center");
  const domRoot = sequencerContainer.appendChild(createElement(virtualRoot));

  const render = (data) => {
    const newVirtualRoot = h("div.center", [
      h("table.pattern", R.concat([h("tr", R.map((element) =>
        h("td", element && String(element)), R.range(0, R.length(data) + 2)))],
      R.mapIndexed((row, rowIndex) =>
        h("tr", R.concat([h("div", h("td", rowsToNotes[rowIndex]))], R.mapIndexed((td, columnIndex) =>
          h("td", h(`div.${classNameFromCode[td]}`, {
            onclick: () => model.update(rowIndex, columnIndex)
          })), row))),
          data)))
        ]);
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    render
  };
};
