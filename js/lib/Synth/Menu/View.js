var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];
  var saveAsPresetInput = null;
  var presetsSelectElement = null;

  var populatePresetsSelectList = () => {
    var jsml = model.getPresets().map((preset) => {
      return {
        tag: "option",
        value: preset,
        text: preset
      };
    });

    while (presetsSelectElement.firstChild) {
      presetsSelectElement.removeChild(presetsSelectElement.firstChild);
    }

    jsmlParse(jsml, presetsSelectElement);
  };

  var jsml = {
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
                element.onclick = () => channels.openPreset()
            },
            {
              tag: "li",
              text: "Save Preset As",
              callback: (element) =>
                element.onclick = () => channels.savePresetAs()
            },
            {
              tag: "li",
              text: "Import Preset",
              callback: (element) =>
                element.onclick = () => channels.importPreset()
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
  };

  channels.populatePresetsSelectList = populatePresetsSelectList;

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
    }
  };
};
