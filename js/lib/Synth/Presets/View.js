var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

module.exports = (channels) => {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];
  var saveAsPresetInput = null;
  var destroyChildren = function destroyChildren (element) {
    if (element.firstChild) {
      element.removeChild(element.firstChild);
      destroyChildren(element);
    }
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
        tag: "p",
        callback: (element) => channels.displayMessage = (message) => {
          destroyChildren(element);
          element.appendChild(document.createTextNode(message));
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
