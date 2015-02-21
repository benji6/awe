var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');
var model = require('./model.js');

module.exports = (channels) => {
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
    callback: (element) => synthViewHolder = element,
    children: [
      {
        tag: "input",
        placeholder: "Preset Name",
        callback: (element) => saveAsPresetInput = element
      },
      {
        tag: "button",
        count: 5,
        text: (count) => buttonLabels[count],
        callback: function (element, jsmlElement, count) {
          element.onclick = () =>
            channels[buttonLabels[count].toLowerCase()](saveAsPresetInput.value);
        }
      },
      {
        tag: "input",
        placeholder: "Paste Import Data Here",
        callback: (element) =>
          channels.import = () => {
            channels.importdata(element.value);
            element.value = "";
          }
      },
      {
        tag: "select",
        callback: (element) => presetsSelectElement = element
      },
      {
        tag: "div",
        callback: (element) => channels.newNotification = (() => {
          var cachedTimeoutId;

          return (message) => {
            window.clearTimeout(cachedTimeoutId);

            var output = element.firstChild;

            output.value = message;
            cachedTimeoutId = window.setTimeout(function () {
              output.value = "";
            }, 5000);
          };
        })(),
        children: {
          tag: "output",
          width: "200px"
        }
      }
    ]
  };

  channels.populatePresetsSelectList = populatePresetsSelectList;

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
      populatePresetsSelectList();
    }
  };
};
