const LZString = require('lz-string');
const R = require('ramda');
const defaultModels = require('./Model.js');
const View = require('./View.js');

module.exports = function (prometheus, model) {
  const savePresetWithName = function (name) {
    console.log(name);
    console.log(model);
  };

  const channels = {
    openPreset: function (value) {
      prometheus(R.filter(function (model) {
        return R.eq(model.name, value);
      }, defaultModels)[0].model);
    },
    savePresetAs: function (value) {
      const presetNameExists = R.filter(function (name) {
        return name === value;
      }, R.pluck("name", defaultModels)).length;
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
      return LZString.compressToEncodedURIComponent(JSON.stringify(model));
    },
    deletePreset: function (value) {
      if (!value) {
        return;
      }
      model.deletePreset(value);
      view.populatePresets();
    }
  };

  const view = View(model, R.pluck("name", defaultModels), channels);

  return {
    view: view
  };
};
