const R = require('ramda');
const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

module.exports = function (pluginName) {
  return {
    connect: function (parentDomEl) {
      const center = createElement(h("div.center"), [
        h('h2', pluginName)
      ]);
      const synthContainer = createElement(h("div." + pluginName));
      center.appendChild(synthContainer);
      parentDomEl.appendChild(center);
      return synthContainer;
    }
  };
};
