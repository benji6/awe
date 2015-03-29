var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

var GainNode = function (volume) {
  var gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

module.exports = function () {
  var controllerChannel = {};
  var model = Model(controllerChannel);
  var view = View(model, controllerChannel);
  var gain = GainNode(model.getModel().gain);

  controllerChannel.gain = function (value) {
    gain.gain.value = model.getModel().gain = +value;
  };

  var connect = function (node) {
    gain.connect(node);
  };

  var destinations = {
    input: gain
  };

  return {
    connect: connect,
    destinations: destinations,
    model: model,
    view: view
  };
};
