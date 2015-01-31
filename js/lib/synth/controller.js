var audioContext = require('../audioContext');
var keyboardInput = require('../keyboard/output.js');
var Oscillator = require('./Oscillator.js');
var GainNode = require('./GainNode.js');
var view = require('./view.js');
var pubsub = require('./pubsub.js');
var model = require('./model.js');

var createOsc = function (type, channel) {
  var osc = Oscillator(type);
  var gainNode = GainNode(model.volume[type]);

  osc.connect(gainNode);
  pubsub.on(channel, (volume) => {
    model.volume[type] = volume;
    gainNode.gain.value = volume;
  });

  return {
    osc,
    gainNode
  };
};

var newNote = function (freq, gainNode) {
  var oscillators = [
    createOsc('square', 'squareVolume'),
    createOsc('sawtooth', 'sawtoothVolume')
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
    model.volume.master = volume;
    gainNode.gain.value = volume;
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
