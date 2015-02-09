var pubsub = require('../pubsub.js');
var model = require('./model.js');
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
  var settings = {
    adsr: adsr.getModel(),
    master: master.getModel(),
    oscillators: oscillators.getModel()
  };
  localStorage.setItem("synthSettings", JSON.stringify(settings));
});

pubsub.on("load", () => {
  var retrievedSettings = JSON.parse(localStorage.getItem("synthSettings"));
  Object.keys(retrievedSettings).forEach((model) => {
    controllers[model].setModel(retrievedSettings[model]);
    //view.render
  });
});

pubsub.on("reset", () => {
  console.log("reset");
});

module.exports = {
  connectViewTo: view.connectTo
};
