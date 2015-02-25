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

module.exports = function (adsrModel) {
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
    var adsrGain = Gain();
    var masterGain = Gain(model.getModel()[type].volume);
    var panner = Panner(model.getModel()[type].panning);
    var newNote = null;

    adsrGain.gain.setValueAtTime(0, audioContext.currentTime);
    adsrGain.gain.linearRampToValueAtTime(1, audioContext.currentTime +
      adsrModel.getModel().a);
    adsrGain.gain.linearRampToValueAtTime(adsrModel.getModel().s,
      audioContext.currentTime +
      adsrModel.getModel().a +
      adsrModel.getModel().d);

    osc.detune.value = 100 * model.getModel()[type].tune +
      model.getModel()[type].detune;
      osc.connect(panner);
      adsrGain.connect(masterGain);
      panner.connect(adsrGain);

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
      adsrGain,
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
      elem.adsrGain.gain.cancelScheduledValues(audioContext.currentTime);
      elem.adsrGain.gain.linearRampToValueAtTime(0, audioContext.currentTime +
        adsrModel.getModel().r);
      window.setTimeout(() => elem.osc.stop(), 1000 * adsrModel.getModel().r + 100);
    });
    activeNotes.delete(freq);
  };

  return {
    connect: (outputAudioNode) => {
      newNote = setOutput(outputAudioNode);
    },
    model,
    noteFinish,
    noteStart,
    view
  };
};
