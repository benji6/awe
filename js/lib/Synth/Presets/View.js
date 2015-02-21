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
              text: "Open Preset"
            },
            {
              tag: "li",
              text: "Save Preset As"
            },
            {
              tag: "li",
              text: "Import Preset"
            },
            {
              tag: "li",
              text: "Export Preset"
            },
            {
              tag: "li",
              text: "Delete Preset"
            },
            {
              tag: "li",
              text: "Initialize Settings"
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
