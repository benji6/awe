var audioContext = require('../../../audioContext');
var View = require('./View.js');

module.exports = (model) => {
  var channels = {};
  var view = View(model, channels);
  var filter = audioContext.createBiquadFilter();

  channels.frequency = (value) => filter.frequency.value = model.frequency = Number(value);
  channels.q = (value) => filter.Q.value = model.q = Number(value);

  channels.type = (value) => {
    filter.type = model.type = value;
    view.render(value);
  };

  channels.gain = (value) => filter.gain.value = model.gain = Number(value);

  filter.type = model.type;
  filter.frequency.value = model.frequency;
  filter.Q.value = model.q;
  filter.gain.value = model.gain;

  return {
    connect: (node) => filter.connect(node),
    destinations: {
      destination: filter,
      frequency: filter.frequency
    },
    id: model.id,
    view
  };
};
