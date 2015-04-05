const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

const pluginName = "Sequencer";

module.exports = (parentDomElement) => {
  const sequencerContainer = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, [
    h("h2", pluginName)
  ])));

  sequencerContainer.appendChild(createElement(h("p", "sequencer will go here")));
};
