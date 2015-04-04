const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

module.exports = function (pluginName, parentDomElement) {
  const prometheusContainer = parentDomElement.appendChild(createElement(h(`div.${R.toLower(pluginName)}`, [
    h("h2", pluginName)
  ])));

  return {
    menu: prometheusContainer.appendChild(createElement(h("div.center"))),
    synth: prometheusContainer.appendChild(createElement(h("div.center")))
  };
};
