module.exports = {
  adsr: require('./synthModuleFactories/Adsr/Controller.js'),
  filter: require('./synthModuleFactories/Filter/Controller.js'),
  lfo: require('./synthModuleFactories/Lfo/Controller.js'),
  master: require('./synthModuleFactories/Master/Controller.js'),
  oscillator: require('./synthModuleFactories/Oscillator/Controller.js')
};
