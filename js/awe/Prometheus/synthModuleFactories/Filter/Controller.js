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

  filter.type = model.type;
  filter.frequency.value = model.frequency;
  filter.Q.value = model.q;
  filter.gain.value = model.gain;

  return {
    connect: function (node) {
      filter.connect(node);
    },
    destinations: {
      destination: filter,
    },
    id: model.id,
    view: view
  };
};
