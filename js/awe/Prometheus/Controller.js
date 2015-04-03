const view = require('./view.js');
const prometheus = require('./prometheus.js');
const model = require('./defaultModels/default.js');
const Menu = require('./Menu/Controller.js');

module.exports = function (parentDomElement, parentDestination, addStartChannel, addStopChannel) {
  const container = view("Prometheus").connect(parentDomElement);

  Menu(function () {}, model).view.connect(container);
  prometheus(model, parentDestination, container, addStartChannel, addStopChannel);
};
