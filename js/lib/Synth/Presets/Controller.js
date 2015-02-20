var View = require('./View.js');

var everyProperty = (obj) =>
  (fn) => {
    Object.keys(obj).forEach((key) => {
      fn(key);
    });
  };

module.exports = function (adsr, master, oscillators) {
  var channels = {};
  var view = View(channels)(["hello", "goodbye"]);
  var controllers = {
    adsr,
    master,
    oscillators
  };
  var everyController = everyProperty(controllers);

  channels.save = (presetKey) => {
    if (!presetKey) {
      channels.newNotification("Please input a preset name");
      return;
    }

    var dataToStore = JSON.parse(localStorage.getItem("prometheus"));
    var presetData = {};

    if (!localStorage.prometheus) {
      dataToStore = {};
    }

    if (dataToStore[presetKey]) {
      channels.newNotification("A preset already exists with this name, overwrite?");
      //dev, need a dialogue box of some sort
      return;
    }

    everyController((key) => {
      presetData[key] = controllers[key].model.getModel();
    });

    dataToStore[presetKey] = presetData;
    localStorage.setItem("prometheus", JSON.stringify(dataToStore));
    channels.newNotification("Preset saved! :)");
  };

  channels.load = () => {
    var newData = JSON.parse(localStorage.getItem("prometheus"));

    everyController((key) => {
      controllers[key].model.setModel(newData[key]);
      controllers[key].view.render();
    });
  };

  channels.reset = () => {
    everyController((key) => {
      controllers[key].model.init();
      controllers[key].view.render();
    });
  };

  channels.importdata = (data) => {
    if (!data) {
      channels.newNotification("No import data, please paste in field");
      return;
    }
    try {
      newData = JSON.parse(data);
    }
    catch (e) {
      channels.newNotification(`error importing preset data: ${e}`);
      return;
    }
    everyController((key) => {
      if (!newData[key]) {
        channels.newNotification(`import preset data warning: no imported data for key ${key}`);
        return;
      }
      controllers[key].model.setModel(newData[key]);
      controllers[key].view.render();
    });
  };

  channels.export = () => {
    var exportData = {};
    everyController((key) => {
      exportData[key] = controllers[key].model.getModel();
    });
    alert(JSON.stringify(exportData));
  };

  return {
    view
  };
};
