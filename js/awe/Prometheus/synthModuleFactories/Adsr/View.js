const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
const createRangeControl = require('../../../Components/createRangeControl.js');

const formatOutput = function (output) {
  return Number(output).toFixed(2);
};

module.exports = function (model, channels) {
  var components = null;

  const connect = function (parentDomEl) {
    const table = createElement(h("table"));
    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: 2}}, "ADSR")
      ])
    ])));

    const componentParams = {
      parent: table,
      name: "a",
      min: 0,
      max: 1,
      observer: channels,
      model: model
    };

    components = [
      createRangeControl(componentParams),
      createRangeControl(R.merge(componentParams, {
        name: "d"
      })),
      createRangeControl(R.merge(componentParams, {
        name: "s"
      })),
      createRangeControl(R.merge(componentParams, {
        name: "r"
      }))
    ];

    parentDomEl.appendChild(createElement(h("div.center"))).appendChild(table);
  };

  return {
    connect: connect,
    render: function () {
      components.forEach(function (component) {
        component.render();
      });
    }
  };
};
