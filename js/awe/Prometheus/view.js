const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

module.exports = (pluginName, parentDomElement) => {
  const prometheusContainer = parentDomElement.appendChild(createElement(h(`div.${R.toLower(pluginName)}`, [
    h("h2", pluginName)
  ])));

  return {
    menu: prometheusContainer.appendChild(createElement(h("div.center"))),
    synth: prometheusContainer.appendChild(createElement(h("div.center")))
  };
};
