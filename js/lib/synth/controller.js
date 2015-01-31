var keyboardController = require('../controllers/keyboard.js');
var Oscillator = require ('./Oscillator.js');
var GainNode = require ('./GainNode.js');

module.exports = (audioCtx) => {
  var gainNode = GainNode(audioCtx);
  gainNode.connect(audioCtx.destination);

  var oscillators = new Map();

  keyboardController.on('keyDown', (freq) => {
    if (oscillators.has(freq)) {
      return;
    }
    var oscillator = Oscillator(audioCtx);
    oscillators.set(freq, oscillator);
    oscillator.connect(gainNode);
    oscillator.frequency.value = freq;
    oscillator.start();
    oscillators.set(freq, oscillator);
  });

  keyboardController.on('keyUp', (freq) => {
    var oscillator = oscillators.get(freq);
    if (!oscillator) {
      return;
    }
    oscillator.stop();
    oscillators.delete(freq);
  });
};
