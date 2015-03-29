const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
var createRangeControl = require('../../../Components/createRangeControl.js');

var capitalizeFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var formatOutput = function (output) {
  return Number(output).toFixed(2);
};

module.exports = function (model, channels, type) {
  var components = [];

  var connect = function (parentDomEl) {
    const table = document.createElement("table");

    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: "2"}}, capitalizeFirst(type))
      ])
    ])));

    var componentParams = {
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

    parentDomEl.appendChild(table);
  };

  return {
    connect: connect,
    render: function () {
      return components.forEach(function (component) {
        return component.render();
      });
    }
  };
};
