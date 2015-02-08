var audioContext = require('../audioContext');
var pubsub = require('./pubsub.js');
var oscillators = require('./oscillators/controller.js');
var master = require('./master/controller.js');
var presetsView = require('./presets/view.js');
var model = require('./model.js');
var view = require('./view.js');

// pubsub.on("save", () => {
//   localStorage.setItem("synthModel", JSON.stringify(model.currentSettings));
// });
//
// pubsub.on("load", () => {
//   model.currentSettings = JSON.parse(localStorage.getItem("synthModel"));
//   masterGainNode.gain.value = model.currentSettings.volume.master;
//   setPannerPosition(masterPanner, model.currentSettings.panning.master);
//   view.render();
// });
//
// pubsub.on("reset", () => {
//   masterGainNode.gain.value = model.defaultSettings.volume.master;
//   setPannerPosition(masterPanner, model.defaultSettings.panning.master);
//   model.currentSettings = model.defaultSettings;
//   view.render();
// });

oscillators.connectOutputTo(master.inputNode);

module.exports = {
  connectOutputTo: (outputAudioNode) => {
    master.connectOutputTo(outputAudioNode);
  },
  connectViewTo: (parentDomElement) => {
    var synthParentView = view.connectViewTo(parentDomElement);
    master.connectViewTo(synthParentView);
    oscillators.connectViewTo(synthParentView);
    presetsView.connectTo(synthParentView);
  }
};
