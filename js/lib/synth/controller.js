var audioContext = require('../audioContext');
var keyboardInput = require('../keyboard/output.js');
var Oscillator = require('./Oscillator.js');
var GainNode = require('./GainNode.js');
var view = require('./view.js');
var pubsub = require('./pubsub.js');
var model = require('./model.js');

var createOsc = function (type) {
  var channel = type + "Volume";
  var osc = Oscillator(type);
  var gainNode = GainNode(model.volume[type]);

  osc.connect(gainNode);
  pubsub.on(channel, (volume) => {
    gainNode.gain.value = model.volume[type] = volume;
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

  pubsub.on('volume', (volume) => {
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
