const audioContext = require('../../../audioContext');
const View = require('./View.js');

const GainNode = (volume) => {
  const gain = audioContext.createGain();
  gain.gain.value = volume;
  return gain;
};

const Panner = (panning) => {
  const panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';
  return setPannerPosition(panner, panning);
};

const setPannerPosition = (panner, panning) => {
  panner.setPosition(panning, 0, 1 - Math.abs(panning));
  return panner;
};

module.exports = (model) => {
  const controllerChannel = {};
  const view = View(model, controllerChannel);
  const gain = GainNode(model.volume);
  const panner = Panner(model.panning);

  controllerChannel.volume = (value) => gain.gain.value = model.volume = Number(value);

  controllerChannel.panning = (value) => {
    model.panning = Number(value);
    setPannerPosition(panner, value);
  };

  const connect = (node) => {
    panner.connect(gain);
    gain.connect(node);
  };

  const destinations = {
    destination: panner
  };

  return {
    connect,
    destinations,
    id: model.id,
    view
  };
};
