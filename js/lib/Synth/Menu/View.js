var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];
  var saveAsPresetInput = null;
  var presetsSelectElement = null;
  var modalContainer = null;

  var populatePresetsSelectList = () => {
    var presets = model.getPresets();
    var jsml = null;

    if (presets) {
      jsml = presets.map((preset) => {
        return {
          tag: "option",
          value: preset,
          text: preset
        };
      });
    } else {
      jsml = {
        disabled: "disabled",
        selected: "selected",
        tag: "option",
        text: "No Saved Presets"
      };
    }

    while (presetsSelectElement.firstChild) {
      presetsSelectElement.removeChild(presetsSelectElement.firstChild);
    }

    jsmlParse(jsml, presetsSelectElement);
  };

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
                  element.onclick = () => openPresetDialog()
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
    },
    {
      tag: "div",
      children: [
        {
          tag: "h3",
          text: "Open Preset"
        },
        {
          tag: "select",
          callback: (element) => presetsSelectElement = element
        },
        {
          tag: "button",
          text: "Open"
        },
        {
          tag: "button",
          text: "Cancel",
          callback: (element) =>
            element.onclick = () => modalContainer.className = "hidden"
        }
      ],
      className: "hidden",
      callback: (element) => modalContainer = element
    }
  ];

  var openPresetDialog = () => {
    modalContainer.className = "modalWindow";
  };

  channels.populatePresetsSelectList = populatePresetsSelectList;

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(menuJsml, parentDomElement);
      populatePresetsSelectList();
    }
  };
};
