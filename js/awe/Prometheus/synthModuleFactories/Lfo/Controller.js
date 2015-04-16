const audioContext = require('../../../audioContext');
const View = require('./View.js');

module.exports = (model) => {
  const gain = audioContext.createGain();
  const lfo = audioContext.createOscillator();

  const controllerChannels = {
    rate: (value) => {
      model.rate = Number(value);
      lfo.frequency.value = model.rate;
      view.render();
    },

    amount: (value) => {
      model.amount = Number(value);
      gain.gain.value = model.amount;
      view.render();
    },

    type: (value) => {
      model.type = value;
      lfo.type = model.type;
    },
  };
  const view = View(model, controllerChannels);

  const connect = (destination) => {
    gain.gain.value = model.amount;
    lfo.type = model.type;
    lfo.frequency.value = model.rate;
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
