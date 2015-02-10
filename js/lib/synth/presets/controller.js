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
  localStorage.setItem("synthSettings", JSON.stringify(getSettings()));
});

pubsub.on("load", () => {
  var retrievedSettings = JSON.parse(localStorage.getItem("synthSettings"));
  Object.keys(retrievedSettings).forEach((key) => {
    controllers[key].setModel(retrievedSettings[key]);
    controllers[key].render();
  });
});

pubsub.on("reset", () => {
  Object.keys(controllers).forEach((key) => {
    controllers[key].init();
    controllers[key].render();
  });
});

module.exports = {
  connectViewTo: view.connectTo
};
