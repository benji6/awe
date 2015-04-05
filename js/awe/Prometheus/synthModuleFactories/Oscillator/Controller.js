const audioContext = require('../../../audioContext');
const View = require('./View.js');
const R = require('ramda');

const Oscillator = (type) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  return oscillator;
};

const Gain = (volume) => {
  volume = volume === undefined ? 1 : volume;
  const gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

const setPannerPosition = (panner, panning) => {
  panner.setPosition(panning, 0, 1 - Math.abs(panning));
  return panner;
};

const Panner = (panning) => {
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

module.exports = (model) => {
  const type = model.type;
  const channels = {};
  const view = View(model, channels, type);
  const activeNotes = {};

  R.forEach((oscillatorParam) =>
    channels[oscillatorParam] = (value) =>
      model[oscillatorParam] = Number(value), oscillatorParams);

  var newNote = () => {};
  var adsr;

  const connect = (output) => {
    newNote = (freq) => {
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

      channels.volume = (volume) => masterGain.gain.value = model.volume = Number(volume);
      channels.tune = (value) => {
        model.tune = Number(value);
        oscillator.detune.value = R.add(R.multiply(100, model.tune),model.detune);
      };
      channels.detune = (cents) => {
        model.detune = Number(cents);
        oscillator.detune.value = R.add(R.multiply(100, model.tune), model.detune);
      };
      channels.panning = (value) => {
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

  const noteStart = (freq) => activeNotes[freq] || newNote(freq);
  const noteStop = (freq) => {
    const oscillator = activeNotes[freq].oscillator;
    const adsrRelease = activeNotes[freq].adsrRelease;
    if (adsrRelease) {
      adsrRelease().then(() => oscillator.stop());
    } else {
      oscillator.stop();
    }
    activeNotes[freq] = null;
  };

  const inputs = {
    gain: (arg) => adsr = arg
  };

  return {
    connect,
    inputs,
    id: model.id,
    noteStop,
    noteStart,
    view
  };
};
