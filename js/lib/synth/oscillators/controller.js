var audioContext = require('../../audioContext');
var pubsub = require('../pubsub.js');
var keyboardInput = require('../../keyboard/output.js');
var adsr = require('../adsr/model.js');
var model = require('./model.js');
var view = require('./view.js');

var activeNotes = new Map();

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
  var gainNode = GainNode(model[type].volume);
  var panner = Panner(model[type].panning);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime +
    adsr.a);
  gainNode.gain.linearRampToValueAtTime(adsr.s,
    audioContext.currentTime +
    adsr.a +
    adsr.d);

  osc.detune.value = 100 * model[type].tune +
  model[type].detune;
  osc.connect(panner);
  panner.connect(gainNode);

  pubsub.on(type + "Volume", (volume) => {
    gainNode.gain.value = model[type].volume = +volume;
  });

  pubsub.on(type + "Tune", (value) => {
    model[type].tune = +value;
    osc.detune.value = 100 * model[type].tune +
    model[type].detune;
  });

  pubsub.on(type + "Detune", (cents) => {
    model[type].detune = +cents;
    osc.detune.value = 100 * model[type].tune +
    model[type].detune;
  });

  pubsub.on(type + "Panning", (value) => {
    model[type].panning = +value;
    setPannerPosition(panner, value);
  });

  return {
    osc,
    gainNode
  };
};

var newNote;

var setOutput = (output) => {
  return (freq) => {
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

    activeNotes.set(freq, oscillators);
  };
};

keyboardInput.on('keyDown', (freq) => {
  if (activeNotes.has(freq)) {
    return;
  }
  newNote(freq);
});

keyboardInput.on('keyUp', (freq) => {
  var oscillators = activeNotes.get(freq);
  if (!oscillators) {
    return;
  }
  oscillators.forEach((elem) => {
    elem.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    elem.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime +
      adsr.r);
    window.setTimeout(() => elem.osc.stop(),
    1000 * adsr.r);
  });
  activeNotes.delete(freq);
});

module.exports = {
  connectAudioTo: (outputAudioNode) => {
    newNote = setOutput(outputAudioNode);
  },
  connectViewTo: view.init
};
