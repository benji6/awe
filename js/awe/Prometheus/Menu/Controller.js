const R = require('ramda');
const LocalStorageController = require('./LocalStorageController.js');
const View = require('./View.js');

module.exports = function (prometheus, model, pluginName) {
  //can not overwrite defaults!

  const localStorageController = LocalStorageController(pluginName);

  const savePresetWithName = function (name) {
    localStorageController.savePreset(name, model);
    prometheus(model);
  };

  const channels = {
    openPreset: function (value) {
      prometheus(localStorageController.openPreset(value));
    },
    savePresetAs: function (value) {
      const presetNameExists = localStorageController.hasPresetKey(value);
      if (presetNameExists) {
        return "A preset already exists with this name, overwrite?";
      }
      savePresetWithName(value);
    },
    overwritePreset: function (value) {
      savePresetWithName(value);
    },
    importPreset: function (value) {
      if (!value) {
        return "No import data, please paste in field";
      }
      try {
        newData = JSON.parse(value);
      }
      catch (e) {
        return `error importing preset data: ${e}`;
      }
      loadPresetFromData(newData);
    },
    exportSettings: function () {
      return localStorageController.compress(JSON.stringify(model));
    },
    deletePreset: function (value) {
      if (!value) {
        return;
      }
      model.deletePreset(value);
      view.populatePresets();
    }
  };

  const view = View(localStorageController, channels);

  return {
    view: view
  };
};
