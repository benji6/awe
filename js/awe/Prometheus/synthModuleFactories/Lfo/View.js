const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');
const createRangeVirtualDom = require('../../../Components/createRangeVirtualDom.js');
const createSelectVirtualDom = require('../../../Components/createSelectVirtualDom.js');
const waveTypes = require('./waveTypes.js');

const formatOutput = (output) => Number(output).toFixed(2);

module.exports = (model, channels) => {
  const componentParams = {
    isLogarithmic: true,
    name: "rate",
    min: 0.05,
    max: 50,
    observer: channels,
    model
  };

  const rangeControlsParams = [
    componentParams,
    R.merge(componentParams, {
      isLogarithmic: false,
      name: "amount",
      min: 500,
      max: 5000
    })
  ];

  const createVirtualRoot = () => h("div.center", h("table", [
    h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: 2}}, "LFO")
      ])
    ]),
    h("tbody", R.concat([
      createSelectVirtualDom({
        model,
        name: "type",
        observer: channels,
        options: waveTypes
      })
    ], R.map(createRangeVirtualDom, rangeControlsParams)))
  ]));

  var domRoot = null;
  var virtualRoot = null;

  const connect = (parentDomEl) => {
    virtualRoot = createVirtualRoot();
    domRoot = createElement(virtualRoot);
    parentDomEl.appendChild(domRoot);
  };

  const render = () => {
    const newVirtualRoot = createVirtualRoot();
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    connect,
    render
  };
};
