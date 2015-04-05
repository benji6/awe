const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const initialPreset = require('./defaultModels/default.js');

const pluginName = "Prometheus";

module.exports = (parentDestination, parentDomElement, startChannel, stopChannel) => {
  const prometheusBound = prometheusUnbound(parentDestination, view(pluginName, parentDomElement), startChannel, stopChannel);

  prometheusBound(initialPreset);
};
