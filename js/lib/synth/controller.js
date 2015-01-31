var keyboardInput = require('../keyboard/output.js');
var Oscillator = require('./Oscillator.js');
var GainNode = require('./GainNode.js');
var view = require('./view.js');
var pubsub = require('./pubsub.js');

var oscillators = new Map();

module.exports = (audioCtx) => {
  var gainNode = GainNode(audioCtx);
  gainNode.gain.value = 0.1;
  gainNode.connect(audioCtx.destination);

  pubsub.on('volume', (volume) => {
    gainNode.gain.value = volume;
  });

  keyboardInput.on('keyDown', (freq) => {
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

  keyboardInput.on('keyUp', (freq) => {
    var oscillator = oscillators.get(freq);
    if (!oscillator) {
      return;
    }
    oscillator.stop();
    oscillators.delete(freq);
  });

  view();

};
