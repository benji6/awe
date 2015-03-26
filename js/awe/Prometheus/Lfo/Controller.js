var audioContext = require('../../audioContext');
// var Oscillator = require('../Oscillator/Controller.js');

module.exports = function () {
  var osc = audioContext.createOscillator();
  osc.frequency.value = 10;
  var gain = audioContext.createGain();
  gain.gain.value = 100;
  osc.connect(gain);
  osc.start();

  return gain;
};
