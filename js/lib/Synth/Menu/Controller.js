var View = require('./View.js');
var Model = require('./Model.js');

var everyProperty = (obj) =>
  (fn) => {
    Object.keys(obj).forEach((key) => {
      fn(key);
    });
  };

module.exports = function (pluginName, adsr, master, oscillators) {
  var channels = {};
  var model = Model(pluginName);
  var view = View(model, channels);
  var controllers = {
    adsr,
    master,
    oscillators
  };
  var everyController = everyProperty(controllers);

  channels.openPreset = (value) => {
    if (!value) {
      return;
    }
  };
  channels.savePresetAs = (value) => {
    alert(value);
  };
  channels.importPreset = (value) => {
    alert(value);
  };
  channels.exportPreset = () => {
    var exportData = {};

    everyController((key) => {
      exportData[key] = controllers[key].model.getModel();
    });

    return JSON.stringify(exportData);
  };
  channels.deletePreset = () => {
    if (!value) {
      return;
    }
    alert('deletePreset');
  };
  channels.initialize = () => {
    alert('initialize');
  };

  channels.save = (presetKey) => {
    if (!presetKey) {
      channels.newNotification("Please input a preset name");
      return;
    }

    if (model.hasPresetKey(presetKey)) {
      channels.newNotification("A preset already exists with this name, overwrite?");
      //dev, need a dialogue box of some sort
      return;
    }

    var presetData = {};

    everyController((key) => {
      presetData[key] = controllers[key].model.getModel();
    });

    model.savePreset(presetKey, presetData);
    channels.populatePresetsSelectList();
    channels.newNotification("Preset saved! :)");
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

  return {
    view
  };
};
