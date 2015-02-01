var audioContext = require('../audioContext');
var keyboardInput = require('../keyboard/output.js');


var view = require('./view.js');
var pubsub = require('./pubsub.js');
var model = require('./model.js');

var Oscillator = (type) => {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;

  return oscillator;
};

var GainNode = (volume) => {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  return gainNode;
};

var createOsc = function (type) {
  var osc = Oscillator(type);
  var gainNode = GainNode(model.volume[type]);

  osc.detune.value = model.detune[type];
  osc.connect(gainNode);

  pubsub.on(type + "Volume", (volume) => {
    gainNode.gain.value = model.volume[type] = volume;
  });

  pubsub.on(type + "Detune", (cents) => {
    osc.detune.value = model.detune[type] = cents * 100;
  });

  return {
    osc,
    gainNode
  };
};

var newNote = function (freq, gainNode) {
  var oscillators = [
    createOsc('sine', 'sineVolume'),
    createOsc('square', 'squareVolume'),
    createOsc('sawtooth', 'sawtoothVolume'),
    createOsc('triangle', 'triangleVolume')
  ];

  oscillators.forEach((element) => {
    element.gainNode.connect(gainNode);
    element.osc.frequency.value = freq;
    element.osc.start();
  });

  model.activeNotes.set(freq, oscillators);
};

module.exports = () => {
  var gainNode = GainNode(model.volume.master);

  pubsub.on('masterVolume', (volume) => {
    gainNode.gain.value = model.volume.master = volume;
  });

  keyboardInput.on('keyDown', (freq) => {
    if (model.activeNotes.has(freq)) {
      return;
    }
    newNote(freq, gainNode);
  });

  keyboardInput.on('keyUp', (freq) => {
    var oscillators = model.activeNotes.get(freq);
    if (!oscillators) {
      return;
    }
    oscillators.forEach((elem) => elem.osc.stop());
    model.activeNotes.delete(freq);
  });

  gainNode.connect(audioContext.destination);

  view();
};
