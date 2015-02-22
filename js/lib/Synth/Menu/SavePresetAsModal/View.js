var jsmlParse = require('../../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var container = null;
  var input = null;
  var message = null;
  var saveButton = null;
  var overwriteButton = null;

  var displayOverwriteState = (response) => {
    saveButton.className = "hidden";
    overwriteButton.className = "";
    input.disabled = true;
    message.value = response;
  };

  var displaySaveState = () => {
    saveButton.className = "";
    overwriteButton.className = "hidden";
    message.value = '';
    input.disabled = false;
  };

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Save Preset As"
      },
      {
        tag: "input",
        placeholder: "Input Preset Name",
        callback: (element) => input = element
      },
      {
        tag: "div",
        children: {
          tag: "output",
          text: "",
          callback: (element) => message = element
        }
      },
      {
        tag: "button",
        text: "Save",
        callback: (element) => {
          saveButton = element;
          element.onclick = () => {
            var response = channels.savePresetAs(input.value);

            if (response) {
              displayOverwriteState(response);
              return;
            }
            container.className = "hidden";
            displaySaveState();
          };
        }
      },
      {
        tag: "button",
        text: "Overwrite",
        className: "hidden",
        callback: (element) => {
          overwriteButton = element;
          element.onclick = () => {
            channels.overwritePreset(input.value);
            displaySaveState();
            container.className = "hidden";
          };
        }
      },
      {
        tag: "button",
        text: "Cancel",
        callback: (element) =>
          element.onclick = () => {
            container.className = "hidden";
            displaySaveState();
          }
      }
    ]
  };

  var open = () => container.className = "modalWindow";

  return {
    jsml,
    open
  };
};
