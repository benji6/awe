var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = () => {
  var channels = {};
  var model = Model(channels);
  var view = View(model, channels);
  var filter = audioContext.createBiquadFilter();

  channels.frequency = (value) => {
    filter.frequency.value = model.getModel().frequency = +value;
  };

  channels.q = (value) => {
    filter.Q.value = model.getModel().q = +value;
  };

  channels.type = (value) => {
    filter.type = model.getModel().type = value;
    view.render(value);
  };

  channels.gain = (value) => {
    filter.gain.value = model.getModel().gain = +value;
  };

  currentModelState = model.getModel();
  filter.type = currentModelState.type;
  filter.frequency.value = currentModelState.frequency;
  filter.Q.value = currentModelState.q;
  filter.gain.value = currentModelState.gain;

  return {
    connect: (node) => filter.connect(node),
    destination: filter,
    model,
    view
  };
};
