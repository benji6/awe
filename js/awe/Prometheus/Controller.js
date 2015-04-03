const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const model = require('./defaultModels/default.js');
const Menu = require('./Menu/Controller.js');

module.exports = function (parentDestination, parentDomElement, addStartChannel, addStopChannel) {
  const containers = view("Prometheus", parentDomElement);
  const prometheusBound = prometheusUnbound(parentDestination, containers.synth, addStartChannel, addStopChannel);

  prometheusBound(model);
  Menu(prometheusBound, model).view.connect(containers.menu);
};
