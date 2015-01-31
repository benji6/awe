var keyboardInput = require('../keyboard/output.js');
var Oscillator = require('./Oscillator.js');
var GainNode = require('./GainNode.js');
var view = require('./view.js');
var pubsub = require('./pubsub.js');

var activeNotes = new Map();

var newNote = function (audioContext, freq, gainNode) {
  var oscillators = [];
  oscillators.push(Oscillator(audioContext, 'square'));
  oscillators.push(Oscillator(audioContext, 'sawtooth'));
  oscillators.forEach((element) => {
    element.connect(gainNode);
    element.frequency.value = freq;
    element.start();
  });
  activeNotes.set(freq, oscillators);
};

module.exports = (audioContext) => {
  var gainNode = GainNode(audioContext);

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
    oscillators.forEach((elem) => elem.stop());
    activeNotes.delete(freq);
  });

  view();
};
