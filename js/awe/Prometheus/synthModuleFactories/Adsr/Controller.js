const audioContext = require('../../../audioContext');
const View = require('./View.js');

const bufferSource = (function () {
  const bufferSource = audioContext.createBufferSource();
  const buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
  buffer.getChannelData(0).set(new Float32Array([1, 1]));
  bufferSource.buffer = buffer;
  bufferSource.loop = true;
  bufferSource.start();
  return bufferSource;
}());

module.exports = function (model) {
  const channels = {
    a: function (value) {
      model.a = Number(value);
    },
    d: function (value) {
      model.d = Number(value);
    },
    s: function (value) {
      model.s = Number(value);
    },
    r: function (value) {
      model.r = Number(value);
    }
  };

  const view = View(model, channels);

  const connect = function (node) {
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;

    bufferSource.connect(gain);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + model.a);
    gain.gain.linearRampToValueAtTime(model.s, audioContext.currentTime + model.a + model.d);
    gain.connect(node);

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

    return release;
  };

  return {
    connect: connect,
    id: model.id,
    view: view
  };
};
