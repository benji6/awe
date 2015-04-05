const R = require('ramda');
const LocalStorageController = require('./LocalStorageController.js');
const View = require('./View.js');

module.exports = function (prometheus, model, pluginName) {
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
      if (R.eq(value, "")) {
        return "Please input a preset name";
      }
      if (localStorageController.hasPresetKey(value)) {
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
        newData = localStorageController.decompressAndParse(value);
      }
      catch (e) {
        return `Error: ${e}`;
      }
      if (!newData) {
        return "Error: data not recognised!";
      }
      prometheus(newData);
    },
    exportSettings: function () {
      return localStorageController.compress(JSON.stringify(model));
    },
    deletePreset: function (value) {
      localStorageController.deletePreset(value);
    }
  };

  const view = View(localStorageController, channels);

  return {
    view: view
  };
};
