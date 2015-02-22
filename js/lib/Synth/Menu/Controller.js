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
    var preset = model.getPreset(value);

    everyController((key) => {
      controllers[key].model.setModel(preset[key]);
      controllers[key].view.render();
    });
  };

  channels.savePresetAs = (value) => {
    if (!value) {
      return "Please input a preset name";
    }
    if (model.hasPresetKey(value)) {
      return "A preset already exists with this name, overwrite?";
    }

    var presetData = {};

    everyController((key) => {
      presetData[key] = controllers[key].model.getModel();
    });
    model.savePreset(value, presetData);
    view.populatePresets();
  };

  channels.overwritePreset = (value) => {
    var presetData = {};

    everyController((key) => {
      presetData[key] = controllers[key].model.getModel();
    });

    model.savePreset(value, presetData);
  };

  channels.importPreset = (value) => {
    if (!value) {
      return "No import data, please paste in field";
    }
    try {
      newData = JSON.parse(value);
    }
    catch (e) {
      return `error importing preset data: ${e}`;
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

  channels.exportPreset = () => {
    var exportData = {};

    everyController((key) => {
      exportData[key] = controllers[key].model.getModel();
    });

    return JSON.stringify(exportData);
  };

  channels.deletePreset = (value) => {
    if (!value) {
      return;
    }
    model.deletePreset(value);
    view.populatePresets();
  };

  channels.initialize = () => {
    everyController((key) => {
      controllers[key].model.init();
      controllers[key].view.render();
    });
  };

  return {
    view
  };
};
