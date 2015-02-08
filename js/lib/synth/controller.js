var audioContext = require('../audioContext');

var oscillators = require('./oscillators/controller.js');
var master = require('./master/controller.js');


var view = require('./view.js');
var presetsView = require('./presets/view.js');

var pubsub = require('./pubsub.js');
var model = require('./model.js');

var parentDomElement = view.init(document.body);
master.connectViewTo(parentDomElement);
oscillators.connectViewTo(parentDomElement);
presetsView.init(parentDomElement);

var GainNode = (volume) => {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  return gainNode;
};

var setPannerPosition = (panner, panning) => {
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


oscillators.connectAudioTo(master.inputNode);


pubsub.on("save", () => {
  localStorage.setItem("synthModel", JSON.stringify(model.currentSettings));
});

pubsub.on("load", () => {
  model.currentSettings = JSON.parse(localStorage.getItem("synthModel"));
  masterGainNode.gain.value = model.currentSettings.volume.master;
  setPannerPosition(masterPanner, model.currentSettings.panning.master);
  view.render();
});

pubsub.on("reset", () => {
  masterGainNode.gain.value = model.defaultSettings.volume.master;
  setPannerPosition(masterPanner, model.defaultSettings.panning.master);
  model.currentSettings = model.defaultSettings;
  view.render();
});

module.exports = () => {
  master.connectOutputTo(audioContext.destination);
};
