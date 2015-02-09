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

var getSettings = () => {
  return {
    adsr: controllers.adsr.getModel(),
    master: controllers.master.getModel(),
    oscillators: controllers.oscillators.getModel()
  };
};

var recursiveDeepCopy = (obj) => {
  var newObj;

  if (typeof obj !== 'object' || !obj) {
    return obj;
  }

  if (obj.constructor === Array) {
    newObj = [];
    obj.forEach((element) => {
      newObj.push(recursiveDeepCopy(element));
    });
    return newObj;
  }

  newObj = {};
  Object.keys(obj).forEach((key) =>
    newObj[key] = recursiveDeepCopy(obj[key]));

  return newObj;
};

model = recursiveDeepCopy(getSettings());

pubsub.on("save", () => {
  localStorage.setItem("synthSettings", JSON.stringify(getSettings()));
});

pubsub.on("load", () => {
  var retrievedSettings = JSON.parse(localStorage.getItem("synthSettings"));
  Object.keys(retrievedSettings).forEach((key) => {
    controllers[key].setModel(retrievedSettings[key]);
    //view.render
  });
});

pubsub.on("reset", () => {
  console.log(model)
  Object.keys(model).forEach((key) => {
    controllers[key].setModel(model[key]);
    //view.render
  });
});

module.exports = {
  connectViewTo: view.connectTo
};
