var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = function () {
  var model = Model();
  var channels = {};
  var view = View(model, channels);

  channels.a = function (value) {
    model.getModel().a = +value;
  };
  channels.d = function (value) {
    model.getModel().d = +value;
  };
  channels.s = function (value) {
    model.getModel().s = +value;
  };
  channels.r = function (value) {
    model.getModel().r = +value;
  };

  var createNode = function () {
    var gain = audioContext.createGain();
    var startTime = audioContext.currentTime;

    var noteFinishThenStopOsc = function (oscillator) {
      var timeElapsed = audioContext.currentTime - startTime;
      var currentGain = 0;
      var releaseTime;

      if (timeElapsed < model.getModel().a) {
        currentGain = timeElapsed / model.getModel().a;
      } else if (timeElapsed < model.getModel().a + model.getModel().d) {
        currentGain = 1 - (1 - model.getModel().s) *
          (timeElapsed - model.getModel().a) / model.getModel().d;
      } else {
        currentGain = model.getModel().s;
      }

      releaseTime = model.getModel().r * currentGain;
      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.setValueAtTime(currentGain, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime +
        releaseTime);

      window.setTimeout(function () {
        oscillator.stop();
      }, 1000 * releaseTime + 50);
    };

    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioContext.currentTime +
      model.getModel().a);
    gain.gain.linearRampToValueAtTime(model.getModel().s,
      audioContext.currentTime +
      model.getModel().a +
      model.getModel().d);

    return {
      connect: function (node) {
        gain.connect(node);
      },
      destination: gain,
      noteFinishThenStopOsc
    };
  };

  return createNode();
};
