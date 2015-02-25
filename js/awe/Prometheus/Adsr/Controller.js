var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = () => {
  var model = Model();
  var channels = {};
  var view = View(model, channels);

  channels.adsrA = (value) => {
    model.a = +value;
  };
  channels.adsrD = (value) => {
    model.d = +value;
  };
  channels.adsrS = (value) => {
    model.s = +value;
  };
  channels.adsrR = (value) => {
    model.r = +value;
  };

  var createNode = () => {
    var gain = audioContext.createGain();
    var startTime = audioContext.currentTime;

    var noteFinish = () => {
      var timeElapsed = audioContext.currentTime - startTime;
      var currentGain = 0;
      
      if (timeElapsed < model.a) {
        currentGain = timeElapsed / model.a;
      } else if (timeElapsed < model.d) {
        currentGain = 1 - (1 - model.s) * (timeElapsed - model.a) / model.d;
      } else {
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime +
          model.r);
        return;
      }

      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.setValueAtTime(currentGain, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime +
        model.r);
    };

    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioContext.currentTime +
      model.a);
    gain.gain.linearRampToValueAtTime(model.s,
      audioContext.currentTime +
      model.a +
      model.d);

    return {
      connect: (node) => gain.connect(node),
      destination: gain,
      noteFinish
    };
  };

  return {
    createNode,
    model,
    view,
    channels
  };
};
