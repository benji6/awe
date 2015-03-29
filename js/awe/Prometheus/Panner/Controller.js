var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

var setPannerPosition = function (panner, panning) {
  var x = panning;
  var z = 1 - Math.abs(x);
  panner.setPosition(x, 0, z);
  return panner;
};

var Panner = function (panning) {
  var panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';
  return setPannerPosition(panner, panning);
};

module.exports = function (params) {
  var controllerChannel = {};
  var model = Model(controllerChannel);
  var view = View(model, controllerChannel);
  var panner = Panner(model.getModel().panning);

  controllerChannel.panning = function (value) {
    model.getModel().panning = +value;
    setPannerPosition(panner, value);
  };

  var connect = function (node) {
    panner.connect(node);
  };

  var destinations = {
    destination: panner
  };

  return {
    connect: connect,
    destinations: destinations,
    id: params.id,
    model: model,
    view: view
  };
};
