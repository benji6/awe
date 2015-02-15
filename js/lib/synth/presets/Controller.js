var View = require('./View.js');

var everyProperty = (obj) =>
  (fn) => {
    Object.keys(obj).forEach((key) => {
      fn(key);
    });
  };

module.exports = function (pubsub, adsr, master, oscillators) {
  var view = View(pubsub);

  var controllers = {
    adsr,
    master,
    oscillators
  };
  var everyController = everyProperty(controllers);

  pubsub.on("save", () => {
    var dataToStore = {};
    everyController((key) => {
      dataToStore[key] = controllers[key].model.getModel();
    });
    localStorage.setItem("synthSettings", JSON.stringify(dataToStore));
  });

  pubsub.on("load", () => {
    var newData = JSON.parse(localStorage.getItem("synthSettings"));
    everyController((key) => {
      controllers[key].model.setModel(newData[key]);
      controllers[key].view.render();
    });
  });

  pubsub.on("reset", () => {
    everyController((key) => {
      controllers[key].model.init();
      controllers[key].view.render();
    });
  });

  pubsub.on("importdata", (data) => {
    try {
      newData = JSON.parse(data);
    }
    catch (e) {
      console.log(`error importing preset data: ${e}`);
      return;
    }
    everyController((key) => {
      if (!newData[key]) {
        console.log(`import preset data warning: no imported data for key ${key}`);
        return;
      }
      controllers[key].model.setModel(newData[key]);
      controllers[key].view.render();
    });
  });

  pubsub.on("export", () => {
    var exportData = {};
    everyController((key) => {
      exportData[key] = controllers[key].model.getModel();
    });
    alert(JSON.stringify(exportData));
  });


  return {
    view
  };
};
