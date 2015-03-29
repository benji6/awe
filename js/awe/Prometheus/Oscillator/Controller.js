var audioContext = require('../../audioContext');
var View = require('./View.js');
var Adsr = require('../Adsr/Controller.js');

var adsr = Adsr();

var Oscillator = function (type) {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;
  return oscillator;
};

var Gain = function (volume) {
  volume = volume === undefined ? 1 : volume;
  var gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

var setPannerPosition = function (panner, panning) {
  var x = panning;
  var z = 1 - Math.abs(x);
  panner.setPosition(x, 0, z);

  return panner;
};

var Panner = function (panning) {
  var panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';
  return setPannerPosition(panner, panning);
};

const oscillatorParams = [
  "volume",
  "tune",
  "detune",
  "panning"
];

module.exports = function (model) {
  const type = model.type;
  var channels = {};
  var view = View(model, channels, type);
  var activeNotes = {};

  oscillatorParams.forEach(function (oscillatorParam) {
    channels[oscillatorParam] = function (value) {
      model[oscillatorParam] = +value;
    };
  });

  var createOscillator = function () {
    var oscillator = Oscillator(type);
    var masterGain = Gain(model.volume);
    var panner = Panner(model.panning);

    oscillator.detune.value = 100 * model.tune + model.detune;
    oscillator.connect(panner);
    adsr.connect(masterGain.gain);
    panner.connect(masterGain);

    channels.volume = function (volume) {
      masterGain.gain.value = model.volume = +volume;
    };

    channels.tune = function (value) {
      model.tune = +value;
      oscillator.detune.value = 100 * model.tune +
      model.detune;
    };

    channels.detune = function (cents) {
      model.detune = +cents;
      oscillator.detune.value = 100 * model.tune +
      model.detune;
    };

    channels.panning = function (value) {
      model.panning = +value;
      setPannerPosition(panner, value);
    };

    return {
      masterGain: masterGain,
      oscillator: oscillator
    };
  };
  var newNote = function () {};
  var connect = function (output) {
    return newNote = function (freq) {
      var oscillator = createOscillator(type);

      oscillator.masterGain.connect(output);
      oscillator.oscillator.frequency.value = freq;
      oscillator.oscillator.start();

      activeNotes[freq] = oscillator;
    };
  };

  var noteStart = function (freq) {
    if (activeNotes[freq]) {
      return;
    }
    newNote(freq);
  };

  var noteStop = function (freq) {
    var oscillator = activeNotes[freq];
    if (!oscillator) {
      return;
    }
    oscillator.oscillator.stop();
    activeNotes[freq] = null;
  };

  var inputs = {
    gain: function (arg) {
      adsr = arg;
    }
  };

  return {
    connect: connect,
    inputs: inputs,
    id: model.id,
    model: model,
    noteStop: noteStop,
    noteStart: noteStart,
    view: view
  };
};
