const view = require('./view.js');
const prometheus = require('./prometheus.js');
const model = require('./defaultModels/basic.js');
const Menu = require('./Menu/Controller.js');

module.exports = function () {
  const menu = Menu(model);
  const synth = prometheus(model);

  synth.connectView = function (parentDomElement) {
    const container = view("Prometheus").connect(parentDomElement);
    menu.view.connect(container);
    synth.view.connect(container);
  };

  return synth;
};
