var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = function (pubsub, adsrModel) {
  var model = Model();
  var view = View(model, pubsub);
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
    var gainNode = GainNode(model.getModel()[type].volume);
    var panner = Panner(model.getModel()[type].panning);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime +
      adsrModel.getModel().a);
      gainNode.gain.linearRampToValueAtTime(adsrModel.getModel().s,
      audioContext.currentTime +
      adsrModel.getModel().a +
      adsrModel.getModel().d);

      osc.detune.value = 100 * model.getModel()[type].tune +
      model.getModel()[type].detune;
      osc.connect(panner);
      panner.connect(gainNode);
      pubsub.on(type + "Volume", (volume) => {
        gainNode.gain.value = model.getModel()[type].volume = +volume;
      });

      pubsub.on(type + "Tune", (value) => {
        model.getModel()[type].tune = +value;
        osc.detune.value = 100 * model.getModel()[type].tune +
        model.getModel()[type].detune;
      });

      pubsub.on(type + "Detune", (cents) => {
        model.getModel()[type].detune = +cents;
        osc.detune.value = 100 * model.getModel()[type].tune +
        model.getModel()[type].detune;
      });

      pubsub.on(type + "Panning", (value) => {
        model.getModel()[type].panning = +value;
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
        createOsc("sine"),
        createOsc("square"),
        createOsc("sawtooth"),
        createOsc("triangle")
        ];

        oscillators.forEach((element) => {
          element.gainNode.connect(output);
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
        elem.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        elem.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime +
          adsrModel.getModel().r);
          window.setTimeout(() => elem.osc.stop(), 1000 * adsrModel.getModel().r);
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
