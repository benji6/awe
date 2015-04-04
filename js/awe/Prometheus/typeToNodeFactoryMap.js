module.exports = {
  adsr: require('./synthModuleFactories/Adsr/Controller.js'),
  filter: require('./synthModuleFactories/Filter/Controller.js'),
  master: require('./synthModuleFactories/Master/Controller.js'),
  oscillator: require('./synthModuleFactories/Oscillator/Controller.js')
};
