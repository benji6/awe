const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
const createRangeControl = require('../../../Components/createRangeControl.js');

const capitalizeFirst = (str) => R.concat(R.toUpper(R.nthChar(0, str)), R.slice(1, R.length(str), str));

module.exports = (model, channels, type) => {
  var components = [];

  const connect = (parentDomEl) => {
    const table = parentDomEl.appendChild(document.createElement("table"));

    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: 2}}, capitalizeFirst(type))
      ])
    ])));

    const componentParams = {
      parent: table,
      name: "volume",
      observer: channels,
      max: 1,
      min: 0,
      model: model
    };

    components = components.concat([
      createRangeControl(componentParams),
      createRangeControl(R.merge(componentParams, {
        max: 1,
        min: -1,
        name: "panning"
      })),
      createRangeControl(R.merge(componentParams, {
        max: 36,
        min: -36,
        name: "tune",
        step: 1
      })),
      createRangeControl(R.merge(componentParams, {
        max: 100,
        min: -100,
        name: "detune"
      }))
    ]);
  };

  return {
    connect
  };
};
