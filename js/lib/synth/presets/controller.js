var pubsub = require('../pubsub.js');
var view = require('./view.js');

var master = require('../master/controller.js');


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


pubsub.on("save", () => {
  console.log("save");
});

pubsub.on("load", () => {
  console.log("load")
});

pubsub.on("reset", () => {
  console.log("reset")
});

module.exports = {
  connectViewTo: view.connectTo
};
