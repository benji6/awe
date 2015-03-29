var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

module.exports = function (params) {
  var channels = {};
  var model = Model(channels);
  var view = View(model, channels);
  var filter = audioContext.createBiquadFilter();

  channels.frequency = function (value) {
    filter.frequency.value = model.getModel().frequency = +value;
  };

  channels.q = function (value) {
    filter.Q.value = model.getModel().q = +value;
  };

  channels.type = function (value) {
    filter.type = model.getModel().type = value;
    view.render(value);
  };

  channels.gain = function (value) {
    filter.gain.value = model.getModel().gain = +value;
  };

  var currentModelState = model.getModel();
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
    id: params.id,
    model: model,
    view: view
  };
};
