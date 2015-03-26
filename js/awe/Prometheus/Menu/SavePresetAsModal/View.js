var jsmlParse = require('jsml-parse');

module.exports = function (model, channels) {
  var container = null;
  var input = null;
  var message = null;
  var saveButton = null;
  var overwriteButton = null;

  var displayOverwriteState = function (response) {
    saveButton.className = "hidden";
    overwriteButton.className = "";
    input.disabled = true;
    message.value = response;
  };

  var displaySaveState = function () {
    saveButton.className = "";
    overwriteButton.className = "hidden";
    message.value = '';
    input.disabled = false;
  };

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: function (element) {
      container = element;
    },
    children: [
      {
        tag: "h3",
        text: "Save Preset As"
      },
      {
        tag: "input",
        placeholder: "Input Preset Name",
        callback: function (element) {
          input = element;
        }
      },
      {
        tag: "div",
        className: "margin",
        children: {
          tag: "output",
          callback: function (element) {
            message = element;
          }
        }
      },
      {
        tag: "button",
        text: "Save",
        callback: function (element) {
          saveButton = element;
          element.onclick = function () {
            if (input.value === "") {
              message.value = "Please input a preset name";
              return;
            }

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
        callback: function (element) {
          overwriteButton = element;
          element.onclick = function () {
            channels.overwritePreset(input.value);
            displaySaveState();
            container.className = "hidden";
          };
        }
      },
      {
        tag: "button",
        text: "Cancel",
        callback: function (element) {
          element.onclick = function () {
            container.className = "hidden";
            displaySaveState();
          };
        }
      }
    ]
  };

  var open = function () {
    container.className = "modalWindow";
  };

  return {
    jsml,
    open
  };
};
