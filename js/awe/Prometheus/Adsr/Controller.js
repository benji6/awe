var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = () => {
  var model = Model();
  var channels = {};
  var view = View(model, channels);

  channels.adsrA = (value) => {
    model.getModel().a = +value;
  };
  channels.adsrD = (value) => {
    model.getModel().d = +value;
  };
  channels.adsrS = (value) => {
    model.getModel().s = +value;
  };
  channels.adsrR = (value) => {
    model.getModel().r = +value;
  };

  var createNode = () => {
    var gain = audioContext.createGain();

    var noteFinish = () => {
      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime +
        model.getModel().r);
    };

    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioContext.currentTime +
      model.getModel().a);
    gain.gain.linearRampToValueAtTime(model.getModel().s,
      audioContext.currentTime +
      model.getModel().a +
      model.getModel().d);

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
