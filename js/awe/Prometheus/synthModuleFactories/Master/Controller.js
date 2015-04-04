const audioContext = require('../../../audioContext');
const View = require('./View.js');

const GainNode = function (volume) {
  const gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

const Panner = function (panning) {
  const panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';
  return setPannerPosition(panner, panning);
};

const setPannerPosition = function (panner, panning) {
  panner.setPosition(panning, 0, 1 - Math.abs(panning));
  return panner;
};

module.exports = function (model) {
  const controllerChannel = {};
  const view = View(model, controllerChannel);
  const gain = GainNode(model.volume);
  const panner = Panner(model.panning);

  controllerChannel.volume = function (value) {
    gain.gain.value = model.volume = Number(value);
  };

  controllerChannel.panning = function (value) {
    model.panning = Number(value);
    setPannerPosition(panner, value);
  };

  const connect = function (node) {
    panner.connect(gain);
    gain.connect(node);
  };

  const destinations = {
    destination: panner
  };

  return {
    connect: connect,
    destinations: destinations,
    id: model.id,
    view: view
  };
};
