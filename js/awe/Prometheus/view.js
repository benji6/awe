const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
var R = require('ramda');

module.exports = function (pluginName) {
  return {
    connect: function (parentDomEl) {
      const center = createElement(h("div.center"), [
        h("h2", pluginName.to)
      ]);
      const synthContainer = createElement(h(`div.${R.toLower(pluginName)}`));
      center.appendChild(synthContainer);
      parentDomEl.appendChild(center);
      return synthContainer;
    }
  };
};
