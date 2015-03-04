var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

var Oscillator = (type) => {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;
  return oscillator;
};

var Gain = (volume = 1) => {
  var gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
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

const oscillatorParams = [
  "volume",
  "tune",
  "detune",
  "panning"
];

module.exports = function (adsr, type) {
  var model = Model(type);
  var channels = {};
  var view = View(model, channels, type);
  var activeNotes = {};

  oscillatorParams.forEach((oscillatorParam) => {
    channels[oscillatorParam] = (value) => {
      model.getModel()[oscillatorParam] = +value;
    };
  });

  var createOscillator = function () {
    var oscillator = Oscillator(type);
    var adsrNode = adsr.createNode();
    var masterGain = Gain(model.getModel().volume);
    var panner = Panner(model.getModel().panning);

    oscillator.detune.value = 100 * model.getModel().tune +
      model.getModel().detune;
    oscillator.connect(panner);
    adsrNode.connect(masterGain);
    panner.connect(adsrNode.destination);

    channels.volume = (volume) => {
      masterGain.gain.value = model.getModel().volume = +volume;
    };

    channels.tune = (value) => {
      model.getModel().tune = +value;
      oscillator.detune.value = 100 * model.getModel().tune +
      model.getModel().detune;
    };

    channels.detune = (cents) => {
      model.getModel().detune = +cents;
      oscillator.detune.value = 100 * model.getModel().tune +
      model.getModel().detune;
    };

    channels.panning = (value) => {
      model.getModel().panning = +value;
      setPannerPosition(panner, value);
    };

    return {
      adsrNode,
      masterGain,
      oscillator
    };
  };
  var newNote = function () {};
  var connect = (output) => newNote = (freq) => {
    var oscillator = createOscillator(type);

    oscillator.masterGain.connect(output);
    oscillator.oscillator.frequency.value = freq;
    oscillator.oscillator.start();

    activeNotes[freq] = oscillator;
  };

  var noteStart = (freq) => {
    if (activeNotes[freq]) {
      return;
    }
    newNote(freq);
  };

  var noteFinish = (freq) => {
    var oscillator = activeNotes[freq];
    if (!oscillator) {
      return;
    }
    oscillator.adsrNode.noteFinishThenStopOsc(oscillator.oscillator);
    activeNotes[freq] = null;
  };

  return {
    connect,
    model,
    noteFinish,
    noteStart,
    view
  };
};
