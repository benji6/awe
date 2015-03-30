var View = require('./View.js');

module.exports = function (model) {
  var channels = {};
  var view = View(model, channels);

  channels.openPreset = function (value) {
    if (!value) {
      return;
    }
    loadPresetFromData(model.getPreset(value));
  };

  channels.savePresetAs = function (value) {
    if (model.hasPresetKey(value)) {
      return "A preset already exists with this name, overwrite?";
    }
    savePresetWithName(value);
  };

  channels.overwritePreset = function (value) {
    savePresetWithName(value);
  };

  channels.importPreset = function (value) {
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
  };

  channels.exportPreset = function () {
    return JSON.stringify(model);
  };

  channels.deletePreset = function (value) {
    if (!value) {
      return;
    }
    model.deletePreset(value);
    view.populatePresets();
  };

  return {
    view: view
  };
};
