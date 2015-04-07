const audioContext = require('../../../audioContext');
const View = require('./View.js');

module.exports = (model) => {
  const channels = {
    freq: (value) => model.freq = Number(value),
  };
  const view = View(model, channels);

  const connect = (destination) => {
    const gain = audioContext.createGain();
    const lfo = audioContext.createOscillator();
    gain.gain.value = model.amplitude;
    lfo.type = model.type;
    lfo.frequency.value = model.frequency;
    lfo.connect(gain);
    gain.connect(destination);
    lfo.start();
  };

  return {
    connect: connect,
    id: model.id,
    view: view
  };
};
