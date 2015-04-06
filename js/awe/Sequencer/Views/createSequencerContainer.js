const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');

const pluginName = "Sequencer";

module.exports = (parentDomElement) => parentDomElement.appendChild(createElement(h(`div.${pluginName}`, h("h2", pluginName))));
