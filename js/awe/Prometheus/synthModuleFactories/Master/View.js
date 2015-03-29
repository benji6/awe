const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
const createRangeControl = require('../../../Components/createRangeControl.js');

module.exports = function (model, channels) {
  const components = [];

  const connect = function (parentDomEl) {
    const table = createElement(h("table"));
    const container = createElement(h("div"));

    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: "2"}}, "Master")
      ])
    ])));

    container.appendChild(table);

    components.push(createRangeControl({
      parent: table,
      name: "gain",
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

    parentDomEl.appendChild(container);
  };

  const render = function () {
    R.forEach(function (component) {
      component.render();
    }, components);
  };

  return {
    connect: connect,
    render: render
  };
};
