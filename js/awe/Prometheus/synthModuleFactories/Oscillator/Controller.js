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

  var newNote = function () {};
  var adsr;

  const connect = function (output) {
    newNote = function (freq) {
      const oscillator = Oscillator(type);
      const masterGain = Gain(model.volume);
      const panner = Panner(model.panning);
      var adsrRelease;

      oscillator.detune.value = 100 * model.tune + model.detune;
      oscillator.connect(panner);

      if (adsr) {
        const adsrGain = Gain(0);
        adsrRelease = adsr.connect(adsrGain.gain);
        panner.connect(adsrGain);
        adsrGain.connect(masterGain);
      } else {
        panner.connect(masterGain);
      }

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

      masterGain.connect(output);
      oscillator.frequency.value = freq;
      oscillator.start();

      activeNotes[freq] = {
        oscillator: oscillator,
        adsrRelease: adsrRelease
      };
    };
  };

  const noteStart = function (freq) {
    activeNotes[freq] || newNote(freq);
  };

  const noteStop = function (freq) {
    const oscillator = activeNotes[freq].oscillator;
    const adsrRelease = activeNotes[freq].adsrRelease;
    if (adsrRelease) {
      adsrRelease().then(function () {
        oscillator.stop();
      });
    } else {
      oscillator.stop();
    }
    activeNotes[freq] = null;
  };

  const inputs = {
    gain: function (arg) {
      adsr = arg;
    }
  };

  return {
    connect: connect,
    inputs: inputs,
    id: model.id,
    noteStop: noteStop,
    noteStart: noteStart,
    view: view
  };
};
