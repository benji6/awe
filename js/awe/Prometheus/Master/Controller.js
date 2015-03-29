var audioContext = require('../../audioContext');
var View = require('./View.js');

var GainNode = function (volume) {
  var gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

module.exports = function (model) {
  var controllerChannel = {};
  var view = View(model, controllerChannel);
  var gain = GainNode(model.gain);

  controllerChannel.gain = function (value) {
    gain.gain.value = model.gain = +value;
  };

  var connect = function (node) {
    gain.connect(node);
  };

  var destinations = {
    destination: gain
  };

  return {
    connect: connect,
    destinations: destinations,
    id: model.id,
    model: model,
    view: view
  };
};
