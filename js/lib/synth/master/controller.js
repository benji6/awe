var audioContext = require('../../audioContext');
var pubsub = require('../pubsub.js');
var model = require('./model.js');
var view = require('./view.js');

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

var panner = Panner(model.getModel().panning);
var gainNode = GainNode(model.getModel().volume);

panner.connect(gainNode);

pubsub.on('masterVolume', (volume) => {
  gainNode.gain.value = model.getModel().volume = +volume;
});

pubsub.on('masterPanning', (value) => {
  model.getModel().panning = +value;
  setPannerPosition(panner, value);
});

module.exports = {
  connectOutputTo: (outputAudioNode) => {
    gainNode.connect(outputAudioNode);
  },
  inputNode: panner,
  model,
  view
};
