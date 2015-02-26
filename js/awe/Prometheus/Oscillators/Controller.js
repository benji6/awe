var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

var oscillatorTypes = [
  "sine",
  "square",
  "sawtooth",
  "triangle"
];

var oscillatorParams = [
  "volume",
  "tune",
  "detune",
  "panning"
];

module.exports = function (adsr) {
  var model = Model();
  var channels = {};
  var view = View(model, channels);
  var activeNotes = new Map();

  oscillatorTypes.forEach((oscillatorType) => {
    oscillatorParams.forEach((oscillatorParam) => {
      channels[oscillatorType + oscillatorParam] = (value) => {
        model.getModel()[oscillatorType][oscillatorParam] = +value;
      };
    });
  });

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

  var createOsc = function (type) {
    var osc = Oscillator(type);
    var adsrNode = adsr.createNode();
    var masterGain = Gain(model.getModel()[type].volume);
    var panner = Panner(model.getModel()[type].panning);
    var newNote = null;

    osc.detune.value = 100 * model.getModel()[type].tune +
      model.getModel()[type].detune;
      osc.connect(panner);
      adsrNode.connect(masterGain);
      panner.connect(adsrNode.destination);

    channels[type + "volume"] = (volume) => {
      masterGain.gain.value = model.getModel()[type].volume = +volume;
    };

    channels[type + "tune"] = (value) => {
      model.getModel()[type].tune = +value;
      osc.detune.value = 100 * model.getModel()[type].tune +
      model.getModel()[type].detune;
    };

    channels[type + "detune"] = (cents) => {
      model.getModel()[type].detune = +cents;
      osc.detune.value = 100 * model.getModel()[type].tune +
      model.getModel()[type].detune;
    };

    channels[type + "panning"] = (value) => {
      model.getModel()[type].panning = +value;
      setPannerPosition(panner, value);
    };

    return {
      adsrNode,
      masterGain,
      osc
    };
  };

  var setOutput = (output) => {
    return (freq) => {
      var oscillators = oscillatorTypes.map((oscillatorType) => {
        return createOsc(oscillatorType);
      });

      oscillators.forEach((element) => {
        element.masterGain.connect(output);
        element.osc.frequency.value = freq;
        element.osc.start();
      });

      activeNotes.set(freq, oscillators);
    };
  };

  var noteStart = (freq) => {
    if (activeNotes.has(freq)) {
      return;
    }
    newNote(freq);
  };

  var noteFinish = (freq) => {
    var oscillators = activeNotes.get(freq);

    if (!oscillators) {
      return;
    }
    oscillators.forEach((elem) => {
      elem.adsrNode.noteFinishTheStopOsc(elem.osc);
    });
    activeNotes.delete(freq);
  };

  return {
    connect: (node) => {
      newNote = setOutput(node);
    },
    model,
    noteFinish,
    noteStart,
    view
  };
};
