var audioContext = require('../audioContext');

module.exports = function (type) {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;

  return oscillator;
};
