var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

module.exports = (channels) => {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];
  var saveAsPresetInput = null;

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
        tag: "div",
        callback: (element) => channels.displayMessage = (message) => {
          var output = element.firstChild;
          output.value = message;
          window.setTimeout(function () {
            output.value = "";
          }, 5000);
        },
        children: {
          tag: "output",
          width: "200px"
        }
      }
    ]
  };

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
    }
  };
};
