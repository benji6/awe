var audioContext = require('../../audioContext');
var Model = require('./Model.js');
var View = require('./View.js');

var GainNode = (volume) => {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  return gainNode;
};

var setPannerPosition = function (panner, panning) {
  var x = panning;
  var z = 1 - Math.abs(x);
  panner.setPosition(x, 0, z);
  return panner;
};

var Panner = (panning) => {
  var panner = audioContext.createPanner();
  panner.panningModel = 'equalpower';

  return setPannerPosition(panner, panning);
};

module.exports = () => {
  var channels = {};
  var model = Model(channels);
  var view = View(model, channels);
  var panner = Panner(model.getModel().panning);
  var gainNode = GainNode(model.getModel().volume);

  panner.connect(gainNode);

  channels.masterVolume = (volume) => {
    gainNode.gain.value = model.getModel().volume = +volume;
  };

  channels.masterPanning = (value) => {
    model.getModel().panning = +value;
    setPannerPosition(panner, value);
  };

  var connect = (outputAudioNode) => {
    gainNode.connect(outputAudioNode);
  };

  return {
    connect,
    destination: panner,
    model,
    view
  };
};
