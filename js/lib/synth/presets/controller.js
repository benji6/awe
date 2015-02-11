var pubsub = require('../pubsub.js');
var view = require('./view.js');
var adsr = require('../adsr/controller.js');
var master = require('../master/controller.js');
var oscillators = require('../oscillators/controller.js');

var controllers = {
  adsr,
  master,
  oscillators
};

pubsub.on("save", () => {
  var dataToStore = {};
  Object.keys(controllers).forEach((key) => {
    dataToStore[key] = controllers[key].model.getModel();
  });
  localStorage.setItem("synthSettings", JSON.stringify(dataToStore));
});

pubsub.on("load", () => {
  var retrievedSettings = JSON.parse(localStorage.getItem("synthSettings"));
  Object.keys(retrievedSettings).forEach((key) => {
    controllers[key].model.setModel(retrievedSettings[key]);
    controllers[key].view.render();
  });
});

pubsub.on("reset", () => {
  Object.keys(controllers).forEach((key) => {
    controllers[key].model.init();
    controllers[key].view.render();
  });
});

module.exports = {
  view
};
