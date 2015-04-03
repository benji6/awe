const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const model = require('./defaultModels/default.js');
const Menu = require('./Menu/Controller.js');

module.exports = function (parentDestination, parentDomElement, addStartChannel, addStopChannel) {
  const container = view("Prometheus").connect(parentDomElement);
  const prometheusBound = prometheusUnbound(parentDestination, container, addStartChannel, addStopChannel);

  Menu(prometheusBound, model).view.connect(container);
  prometheusBound(model);
};
