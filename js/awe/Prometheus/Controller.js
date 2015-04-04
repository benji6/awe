const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const defaultModels = require('./defaultModels/default.js');

const pluginName = "Prometheus";

module.exports = function (parentDestination, parentDomElement, startChannel, stopChannel) {
  const prometheusBound = prometheusUnbound(parentDestination, view(pluginName, parentDomElement), startChannel, stopChannel);

  prometheusBound(defaultModels);
};
