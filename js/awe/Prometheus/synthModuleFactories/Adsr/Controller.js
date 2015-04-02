var audioContext = require('../../../audioContext');
var View = require('./View.js');

var bufferSource = (function () {
  var bufferSource = audioContext.createBufferSource();
  var buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
  buffer.getChannelData(0).set(new Float32Array([1,1]));
  bufferSource.buffer = buffer;
  bufferSource.loop = true;
  bufferSource.start();

  return bufferSource;
}());

module.exports = function (model) {
  var channels = {};
  var view = View(model, channels);

  channels.a = function (value) {
    model.a = +value;
  };
  channels.d = function (value) {
    model.d = +value;
  };
  channels.s = function (value) {
    model.s = +value;
  };
  channels.r = function (value) {
    model.r = +value;
  };

  var gain = audioContext.createGain();
  bufferSource.connect(gain);
  var startTime = audioContext.currentTime;

  const release = function (oscillator) {
    return new Promise(function (resolve) {
      const timeElapsed = audioContext.currentTime - startTime;
      var currentGain = 0;

      if (timeElapsed < model.a) {
        currentGain = timeElapsed / model.a;
      } else if (timeElapsed < model.a + model.d) {
        currentGain = 1 - (1 - model.s) *
          (timeElapsed - model.a) / model.d;
      } else {
        currentGain = model.s;
      }

      const releaseTime = model.r * currentGain;
      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.setValueAtTime(currentGain, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + releaseTime);

      window.setTimeout(function () {
        resolve();
      }, 1000 * releaseTime + 50);
    });
  };

  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + model.a);
  gain.gain.linearRampToValueAtTime(model.s,
    audioContext.currentTime + model.a + model.d);

  var connect = function (node) {
    gain.connect(node);
  };

  return {
    connect: connect,
    release: release,
    id: model.id,
    view: view
  };
};
