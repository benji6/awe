var audioContext = require('../../../audioContext');
var View = require('./View.js');

module.exports = function (model) {
  var channels = {};
  var view = View(model, channels);
  var filter = audioContext.createBiquadFilter();

  channels.frequency = function (value) {
    filter.frequency.value = model.frequency = +value;
  };

  channels.q = function (value) {
    filter.Q.value = model.q = +value;
  };

  channels.type = function (value) {
    filter.type = model.type = value;
    view.render(value);
  };

  channels.gain = function (value) {
    filter.gain.value = model.gain = +value;
  };

  var currentModelState = model;
  filter.type = currentModelState.type;
  filter.frequency.value = currentModelState.frequency;
  filter.Q.value = currentModelState.q;
  filter.gain.value = currentModelState.gain;

  var destinations = {
    destination: filter,
  };

  return {
    connect: function (node) {
      filter.connect(node);
    },
    destinations: destinations,
    id: model.id,
    model: model,
    view: view
  };
};
