var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var OpenPresetModal = require('./OpenPresetModal/View.js');
var SavePresetAsModal = require('./SavePresetAsModal/View.js');
var ImportPresetModal = require('./ImportPresetModal/View.js');
var ExportPresetModal = require('./ExportPresetModal/View.js');
var DeletePresetModal = require('./DeletePresetModal/View.js');
var InitializeSettingsModal = require('./InitializeSettingsModal/View.js');

module.exports = function (model, channels) {
  var openPresetModal = OpenPresetModal(model, channels);
  var savePresetAsModal = SavePresetAsModal(model, channels);
  var importPresetModal = ImportPresetModal(channels);
  var exportPresetModal = ExportPresetModal(model, channels);
  var deletePresetModal = DeletePresetModal(model, channels);
  var initializeSettingsModal = InitializeSettingsModal(channels);

  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];

  var menuJsml = [
    {
      tag: "nav",
      children: {
        tag: "ul",
        children: {
          tag: "li",
          text: "Menu",
          children: {
            tag: "ul",
            children: [
              {
                tag: "li",
                text: "Open Preset",
                callback: (element) =>
                  element.onclick = openPresetModal.open
              },
              {
                tag: "li",
                text: "Save Preset As",
                callback: (element) =>
                  element.onclick = savePresetAsModal.open
              },
              {
                tag: "li",
                text: "Import Preset",
                callback: (element) =>
                element.onclick = importPresetModal.open
              },
              {
                tag: "li",
                text: "Export Preset",
                callback: (element) =>
                  element.onclick = exportPresetModal.open
              },
              {
                tag: "li",
                text: "Delete Preset",
                callback: (element) =>
                  element.onclick = deletePresetModal.open
              },
              {
                tag: "li",
                text: "Initialize Settings",
                callback: (element) =>
                  element.onclick = initializeSettingsModal.open
              },
            ]
          }
        }
      }
    },
    openPresetModal.jsml,
    savePresetAsModal.jsml,
    importPresetModal.jsml,
    exportPresetModal.jsml,
    deletePresetModal.jsml,
    initializeSettingsModal.jsml
  ];

  return {
    connectTo: (parentDomElement) => {
      var presets = model.getPresets();

      jsmlParse(menuJsml, parentDomElement);
      openPresetModal.populatePresets(presets);
      deletePresetModal.populatePresets(presets);
    }
  };
};
