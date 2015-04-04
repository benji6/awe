const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const model = require('./defaultModels/default.js');
const Menu = require('./Menu/Controller.js');

module.exports = function (parentDestination, parentDomElement, startChannel, stopChannel) {
  const containers = view("Prometheus", parentDomElement);
  const prometheusBound = prometheusUnbound(parentDestination, containers.synth, startChannel, stopChannel);

  prometheusBound(model);
  Menu(prometheusBound, model).view.connect(containers.menu);
};
