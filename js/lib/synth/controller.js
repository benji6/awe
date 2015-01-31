var keyboardInput = require('../keyboard/output.js');
var Oscillator = require('./Oscillator.js');
var GainNode = require('./GainNode.js');
var view = require('./view.js');
var pubsub = require('./pubsub.js');

var activeNotes = new Map();

var createOsc = function (audioContext, type, channel) {
  var osc = Oscillator(audioContext, type);
  var gainNode = GainNode(audioContext, 0.1);
  osc.connect(gainNode);
  pubsub.on(channel, (volume) => {
    gainNode.gain.value = volume;
  });

  return {
    osc,
    gainNode
  };
};

var newNote = function (audioContext, freq, gainNode) {
  var oscillators = [
    createOsc(audioContext, 'square', 'squareVolume'),
    createOsc(audioContext, 'sawtooth', 'sawtoothVolume')
  ];

  oscillators.forEach((element) => {
    element.gainNode.connect(gainNode);
    element.osc.frequency.value = freq;
    element.osc.start();
  });
  activeNotes.set(freq, oscillators);
};

module.exports = (audioContext) => {
  var gainNode = GainNode(audioContext, 0.1);
  pubsub.on('volume', (volume) => {
    gainNode.gain.value = volume;
  });
  keyboardInput.on('keyDown', (freq) => {
    if (activeNotes.has(freq)) {
      return;
    }
    newNote(audioContext, freq, gainNode);
  });

  keyboardInput.on('keyUp', (freq) => {
    var oscillators = activeNotes.get(freq);
    if (!oscillators) {
      return;
    }
    oscillators.forEach((elem) => elem.osc.stop());
    activeNotes.delete(freq);
  });

  gainNode.connect(audioContext.destination);

  view();
};
