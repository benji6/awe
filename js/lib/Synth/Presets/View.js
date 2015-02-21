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
    tag: "div",
    children: {
      tag: "menu",
      text: "Menu",
      children: [
        {
          tag: "menuitem",
          text: "Open Preset"
        },
        {
          tag: "menuitem",
          text: "Save Preset As"
        },
        {
          tag: "menuitem",
          text: "Import Preset"
        },
        {
          tag: "menuitem",
          text: "Export Preset"
        },
        {
          tag: "menuitem",
          text: "Delete Preset"
        },
        {
          tag: "menuitem",
          text: "Initialize Settings"
        },
      ]
    }
  };

  channels.populatePresetsSelectList = populatePresetsSelectList;

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
    }
  };
};
