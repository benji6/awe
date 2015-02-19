var View = require('./View.js');

var everyProperty = (obj) =>
  (fn) => {
    Object.keys(obj).forEach((key) => {
      fn(key);
    });
  };

module.exports = function (adsr, master, oscillators) {
  var channels = {};
  var view = View(channels);
  var controllers = {
    adsr,
    master,
    oscillators
  };
  var everyController = everyProperty(controllers);

  channels.save = (presetKey) => {
    if (!presetKey) {
      channels.displayMessage("Please input a preset name");
      return;
    }
    alert(presetKey);
    var dataToStore = {};
    everyController((key) => {
      dataToStore[key] = controllers[key].model.getModel();
    });
    //get stored data object, if new property append, if amended then second dialog
    //to check with user then overwrite or abandon
    localStorage.setItem("synthPresets", JSON.stringify(dataToStore));
  };

  channels.load = () => {
    var newData = JSON.parse(localStorage.getItem("synthSettings"));
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
      channels.displayMessage("No import data, please paste in field");
      return;
    }
    try {
      newData = JSON.parse(data);
    }
    catch (e) {
      channels.displayMessage(`error importing preset data: ${e}`);
      return;
    }
    everyController((key) => {
      if (!newData[key]) {
        channels.displayMessage(`import preset data warning: no imported data for key ${key}`);
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
