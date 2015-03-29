var View = require('./View.js');

module.exports = function (pluginName, controllers) {
  var channels = {};
  var view = View(model, channels);

  var savePresetWithName = function (name) {
    var presetData = controllers.map(function (controller) {
      return controller.model;
    });

    model.savePreset(name, presetData);
    view.populatePresets();
  };

  var loadPresetFromData = function (presetData) {
    presetData.forEach(function (presetObj) {
      var controller = controllers.filter(function (controller) {
        return controller.model.name === presetObj.name;
      })[0];
      controller.model.setModel(presetObj);
      controller.view.render();
    });
  };

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
    return JSON.stringify(controllers.map(function (controller) {
      return controller.model;
    }));
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
