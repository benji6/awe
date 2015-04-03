const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
const createRangeControl = require('../../../Components/createRangeControl.js');

module.exports = function (model, channels) {
  const components = [];

  const connect = function (parentDomEl) {
    const table = parentDomEl
      .appendChild(createElement(h("div")))
      .appendChild(createElement(h("table")));

    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: 2}}, "Master")
      ])
    ])));

    components.push(createRangeControl({
      parent: table,
      name: "volume",
      min: 0,
      max: 1,
      observer: channels,
      model: model
    }));

    components.push(createRangeControl({
      parent: table,
      name: "panning",
      min: -1,
      max: 1,
      observer: channels,
      model: model
    }));
  };

  return {
    connect: connect
  };
};
