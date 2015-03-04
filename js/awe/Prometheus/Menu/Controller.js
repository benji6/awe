var View = require('./View.js');
var Model = require('./Model.js');

module.exports = function (pluginName, controllers) {
  var channels = {};
  var model = Model(pluginName);
  var view = View(model, channels);

  var savePresetWithName = (name) => {
    var presetData = controllers.map((controller) => {
      return controller.model.getModel();
    });

    model.savePreset(name, presetData);
    view.populatePresets();
  };

  var loadPresetFromData = (presetData) => {
    presetData.forEach((presetObj) => {
      var controller = controllers.filter((controller) => {
        return controller.model.getModel().name === presetObj.name;
      })[0];
      controller.model.setModel(presetObj);
      controller.view.render();
    });
  };

  channels.openPreset = (value) => {
    if (!value) {
      return;
    }
    loadPresetFromData(model.getPreset(value));
  };

  channels.savePresetAs = (value) => {
    if (model.hasPresetKey(value)) {
      return "A preset already exists with this name, overwrite?";
    }
    savePresetWithName(value);
  };

  channels.overwritePreset = (value) => {
    savePresetWithName(value);
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
    loadPresetFromData(newData);
  };

  channels.exportPreset = () => JSON.stringify(controllers.map((controller) =>
    controller.model.getModel()));

  channels.deletePreset = (value) => {
    if (!value) {
      return;
    }
    model.deletePreset(value);
    view.populatePresets();
  };

  channels.initialize = function () {
    controllers.forEach((controller) => {
      controller.model.init();
      controller.view.render();
    });
  };

  return {
    view
  };
};
