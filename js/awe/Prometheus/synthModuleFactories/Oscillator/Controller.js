const audioContext = require('../../../audioContext');
const View = require('./View.js');
const R = require('ramda');

const Oscillator = function (type) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  return oscillator;
};

const Gain = function (volume) {
  volume = volume === undefined ? 1 : volume;
  const gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

const setPannerPosition = function (panner, panning) {
  panner.setPosition(panning, 0, 1 - Math.abs(panning));
  return panner;
};

const Panner = function (panning) {
  const panner = audioContext.createPanner();
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
  const channels = {};
  const view = View(model, channels, type);
  const activeNotes = {};

  R.forEach(function (oscillatorParam) {
    channels[oscillatorParam] = function (value) {
      model[oscillatorParam] = Number(value);
    };
  }, oscillatorParams);

  const createOscillator = function () {
    const oscillator = Oscillator(type);
    const masterGain = Gain(model.volume);
    const panner = Panner(model.panning);

    oscillator.detune.value = 100 * model.tune + model.detune;
    oscillator.connect(panner);
    adsr.connect(masterGain.gain);
    panner.connect(masterGain);

    channels.volume = function (volume) {
      masterGain.gain.value = model.volume = Number(volume);
    };

    channels.tune = function (value) {
      model.tune = Number(value);
      oscillator.detune.value = R.add(R.multiply(100, model.tune),model.detune);
    };

    channels.detune = function (cents) {
      model.detune = Number(cents);
      oscillator.detune.value = R.add(R.multiply(100, model.tune), model.detune);
    };

    channels.panning = function (value) {
      model.panning = Number(value);
      setPannerPosition(panner, value);
    };

    return {
      adsr: adsr,
      masterGain: masterGain,
      oscillator: oscillator
    };
  };

  var noteStop = function () {};
  var newNote = function () {};

  const connect = function (output) {
    newNote = function (freq) {
      const oscillator = createOscillator(type);
      const adsr = oscillator.adsr;

      ret.noteStop = function (freq) {
        adsr.release().then(function () {
          const oscillator = activeNotes[freq];
          oscillator && oscillator.oscillator.stop();
          activeNotes[freq] = null;
        });
      };

      oscillator.masterGain.connect(output);
      oscillator.oscillator.frequency.value = freq;
      oscillator.oscillator.start();

      activeNotes[freq] = oscillator;
    };
  };

  const noteStart = function (freq) {
    activeNotes[freq] || newNote(freq);
  };

  const inputs = {
    gain: function (arg) {
      adsr = arg;
    }
  };

  const ret = {
    connect: connect,
    inputs: inputs,
    id: model.id,
    noteStop: noteStop,
    noteStart: noteStart,
    view: view
  };

  return ret;
};
