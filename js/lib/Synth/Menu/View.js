var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];
  var saveAsPresetInput = null;
  var openPresetContainer = null;
  var openPresetSelect = null;
  var savePresetAsContainer = null;
  var savePresetAsInput = null;
  var importPresetContainer = null;
  var importPresetInput = null;

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
        text: "No Saved Presets",
        value: ""
      };
    }

    while (openPresetSelect.firstChild) {
      openPresetSelect.removeChild(openPresetSelect.firstChild);
    }

    jsmlParse(jsml, openPresetSelect);
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
                  element.onclick = () =>
                    openPresetContainer.className = "modalWindow"
              },
              {
                tag: "li",
                text: "Save Preset As",
                callback: (element) =>
                  element.onclick = () =>
                    savePresetAsContainer.className = "modalWindow"
              },
              {
                tag: "li",
                text: "Import Preset",
                callback: (element) =>
                  element.onclick = () =>
                    importPresetContainer.className = "modalWindow"
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
      className: "hidden",
      callback: (element) => openPresetContainer = element,
      children: [
        {
          tag: "h3",
          text: "Open Preset"
        },
        {
          tag: "select",
          callback: (element) => openPresetSelect = element
        },
        {
          tag: "button",
          text: "Open",
          callback: (element) =>
            element.onclick = () =>
              channels.openPreset(openPresetSelect.value)
        },
        {
          tag: "button",
          text: "Cancel",
          callback: (element) =>
            element.onclick = () => openPresetContainer.className = "hidden"
        }
      ]
    },
    {
      tag: "div",
      className: "hidden",
      callback: (element) => savePresetAsContainer = element,
      children: [
        {
          tag: "h3",
          text: "Save Preset As"
        },
        {
          tag: "input",
          callback: (element) =>
            savePresetAsInput = element
        },
        {
          tag: "button",
          text: "Save",
          callback: (element) =>
            element.onclick = () =>
              channels.savePresetAs(savePresetAsInput.value)
        },
        {
          tag: "button",
          text: "Cancel",
          callback: (element) =>
            element.onclick = () => savePresetAsContainer.className = "hidden"
        }
      ]
    },
    {
      tag: "div",
      className: "hidden",
      callback: (element) => importPresetContainer = element,
      children: [
        {
          tag: "h3",
          text: "Import Preset"
        },
        {
          tag: "input",
          callback: (element) =>
            importPresetInput = element
        },
        {
          tag: "button",
          text: "Import",
          callback: (element) =>
            element.onclick = () =>
              channels.importPreset(importPresetInput.value)
        },
        {
          tag: "button",
          text: "Cancel",
          callback: (element) =>
            element.onclick = () => importPresetContainer.className = "hidden"
        }
      ]
    }
  ];

  channels.populatePresetsSelectList = populatePresetsSelectList;

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(menuJsml, parentDomElement);
      populatePresetsSelectList();
    }
  };
};
