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
  var gainNode = GainNode(model.currentSettings.volume[type]);
  var panner = Panner(model.currentSettings.panning[type]);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime +
    model.currentSettings.adsr.a);
  gainNode.gain.linearRampToValueAtTime(model.currentSettings.adsr.s, audioContext.currentTime +
    model.currentSettings.adsr.a +
    model.currentSettings.adsr.d);

  osc.detune.value = 100 * model.currentSettings.tune[type] +
    model.currentSettings.detune[type];
  osc.connect(panner);
  panner.connect(gainNode);

  pubsub.on(type + "Volume", (volume) => {
    gainNode.gain.value = model.currentSettings.volume[type] = +volume;
  });

  pubsub.on(type + "Tune", (value) => {
    model.currentSettings.tune[type] = +value;
    osc.detune.value = 100 * model.currentSettings.tune[type] +
      model.currentSettings.detune[type];
  });

  pubsub.on(type + "Detune", (cents) => {
    model.currentSettings.detune[type] = +cents;
    osc.detune.value = 100 * model.currentSettings.tune[type] +
      model.currentSettings.detune[type];
  });

  pubsub.on(type + "Panning", (value) => {
    model.currentSettings.panning[type] = +value;
    setPannerPosition(panner, value);
  });

  return {
    osc,
    gainNode
  };
};

var newNote = function (freq, output) {
  var oscillators = [
    createOsc('sine', 'sineVolume'),
    createOsc('square', 'squareVolume'),
    createOsc('sawtooth', 'sawtoothVolume'),
    createOsc('triangle', 'triangleVolume')
  ];

  oscillators.forEach((element) => {
    element.gainNode.connect(output);
    element.osc.frequency.value = freq;
    element.osc.start();
  });

  model.activeNotes.set(freq, oscillators);
};

var masterPanner = Panner(model.currentSettings.panning.master);
var masterGainNode = GainNode(model.currentSettings.volume.master);

pubsub.on("save", () => {
  localStorage.setItem("synthModel", JSON.stringify(model.currentSettings));
});

pubsub.on("load", () => {
  model.currentSettings = JSON.parse(localStorage.getItem("synthModel"));
  masterGainNode.gain.value = model.currentSettings.volume.master;
  setPannerPosition(masterPanner, model.currentSettings.panning.master);
  view.render();
});

pubsub.on("reset", () => {
  masterGainNode.gain.value = model.defaultSettings.volume.master;
  setPannerPosition(masterPanner, model.defaultSettings.panning.master);
  model.currentSettings = model.defaultSettings;
  view.render();
});

module.exports = () => {
  pubsub.on('masterVolume', (volume) => {
    masterGainNode.gain.value = model.currentSettings.volume.master = +volume;
  });
  pubsub.on('masterPanning', (value) => {
    model.currentSettings.panning.master = +value;
    setPannerPosition(masterPanner, value);
  });

  keyboardInput.on('keyDown', (freq) => {
    if (model.activeNotes.has(freq)) {
      return;
    }
    newNote(freq, masterPanner);
  });

  keyboardInput.on('keyUp', (freq) => {
    var oscillators = model.activeNotes.get(freq);
    if (!oscillators) {
      return;
    }
    oscillators.forEach((elem) => {
      elem.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      elem.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime +
        model.currentSettings.adsr.r);
      window.setTimeout(() => elem.osc.stop(),
        1000 * model.currentSettings.adsr.r);
    });
    model.activeNotes.delete(freq);
  });

  masterPanner.connect(masterGainNode);
  masterGainNode.connect(audioContext.destination);
};
