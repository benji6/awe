var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');
var Adsr = require('../Adsr/Controller.js');

var adsr = Adsr();

var Oscillator = function (type) {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;
  return oscillator;
};

var Gain = function (volume = 1) {
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

module.exports = function (type) {
  var model = Model(type);
  var channels = {};
  var view = View(model, channels, type);
  var activeNotes = {};

  oscillatorParams.forEach(function (oscillatorParam) {
    channels[oscillatorParam] = function (value) {
      model.getModel()[oscillatorParam] = +value;
    };
  });

  var createOscillator = function () {
    var oscillator = Oscillator(type);
    var masterGain = Gain(model.getModel().volume);
    var panner = Panner(model.getModel().panning);

    oscillator.detune.value = 100 * model.getModel().tune + model.getModel().detune;
    oscillator.connect(panner);
    adsr.connect(masterGain.gain);
    panner.connect(masterGain);

    channels.volume = function (volume) {
      masterGain.gain.value = model.getModel().volume = +volume;
    };

    channels.tune = function (value) {
      model.getModel().tune = +value;
      oscillator.detune.value = 100 * model.getModel().tune +
      model.getModel().detune;
    };

    channels.detune = function (cents) {
      model.getModel().detune = +cents;
      oscillator.detune.value = 100 * model.getModel().tune +
      model.getModel().detune;
    };

    channels.panning = function (value) {
      model.getModel().panning = +value;
      setPannerPosition(panner, value);
    };

    return {
      masterGain,
      oscillator
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
    connect,
    inputs,
    model,
    noteStop,
    noteStart,
    view
  };
};
