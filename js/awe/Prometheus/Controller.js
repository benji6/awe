const view = require('./view.js');
const prometheusUnbound = require('./prometheus.js');
const initialPreset = require('./defaultModels/default.js');

const pluginName = "Prometheus";

module.exports = (parentDestination, parentDomElement, startChannels, stopChannels) => {
  const prometheusBound = prometheusUnbound(parentDestination, view(pluginName, parentDomElement), startChannels, stopChannels);

  prometheusBound(initialPreset);
};
