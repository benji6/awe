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

var setPannerPosition = (panner, panning) => {
  var x = panning;
  var z = 1 - Math.abs(x);
  panner.setPosition(x, 0, z);

  return panner;
};

var Panner = (panning) => {
  var panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';

  return setPannerPosition(panner, panning);
};

var createOsc = function (type) {
  var osc = Oscillator(type);
  var gainNode = GainNode(model.volume[type]);
  var panner = Panner(model.panning[type]);

  osc.detune.value = model.detune[type];
  osc.connect(panner);
  panner.connect(gainNode);

  pubsub.on(type + "Volume", (volume) => {
    gainNode.gain.value = model.volume[type] = volume;
  });

  pubsub.on(type + "Detune", (cents) => {
    osc.detune.value = model.detune[type] = cents;
  });

  pubsub.on(type + "Panning", (value) => {
    model.panning[type] = value;
    setPannerPosition(panner, value);
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

pubsub.on("save", () => localStorage.setItem("synthModel", JSON.stringify(model)));

pubsub.on("load", () => {
  var retrieved = JSON.parse(localStorage.getItem("synthModel"));
  model.volume = retrieved.volume;
  model.detune = retrieved.detune;
  model.panning = retrieved.panning;
  view.render();
});

pubsub.on("reset", () => {
  var retrieved = JSON.parse(localStorage.getItem("synthModel"));
  model.volume = model.defaults.volume;
  model.detune = model.defaults.detune;
  model.panning = model.defaults.panning;
  view.render();
});

module.exports = () => {
  var panner = Panner(model.panning.master);
  var gainNode = GainNode(model.volume.master);

  pubsub.on('masterVolume', (volume) => {
    gainNode.gain.value = model.volume.master = volume;
  });
  pubsub.on('masterPanning', (value) => {
    model.panning.master = value;
    setPannerPosition(panner, value);
  });

  keyboardInput.on('keyDown', (freq) => {
    if (model.activeNotes.has(freq)) {
      return;
    }
    newNote(freq, panner);
  });

  keyboardInput.on('keyUp', (freq) => {
    var oscillators = model.activeNotes.get(freq);
    if (!oscillators) {
      return;
    }
    oscillators.forEach((elem) => elem.osc.stop());
    model.activeNotes.delete(freq);
  });

  panner.connect(gainNode);
  gainNode.connect(audioContext.destination);
};
