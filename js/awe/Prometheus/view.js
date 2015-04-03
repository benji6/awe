const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

module.exports = function (pluginName, parenDomElement) {
  return parenDomElement
    .appendChild(createElement(h("div.center")))
    .appendChild(createElement(h(`div.${R.toLower(pluginName)}`, [
      h("h2", pluginName)
    ])));
};
