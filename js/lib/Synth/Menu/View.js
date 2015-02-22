var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var OpenPresetModal = require('./OpenPresetModal/View.js');
var SavePresetAsModal = require('./SavePresetAsModal/View.js');
var ImportPresetModal = require('./ImportPresetModal/View.js');

module.exports = function (model, channels) {
  var openPresetModal = OpenPresetModal(model, channels);
  var savePresetAsModal = SavePresetAsModal(model, channels);
  var importPresetModal = ImportPresetModal(model, channels);

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
                  element.onclick = () => channels.exportPreset()
              },
              {
                tag: "li",
                text: "Delete Preset",
                callback: (element) =>
                  element.onclick = () => channels.deletePreset()
              },
              {
                tag: "li",
                text: "Initialize Settings",
                callback: (element) =>
                  element.onclick = () => channels.initialize()
              },
            ]
          }
        }
      }
    },
    openPresetModal.jsml,
    savePresetAsModal.jsml,
    importPresetModal.jsml
  ];

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(menuJsml, parentDomElement);
      openPresetModal.populatePresets();
    }
  };
};
