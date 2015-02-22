var jsmlParse = require('../../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var container = null;
  var select = null;
  var message = null;
  var defaultMessage = "Permanently delete preset";
  var deleteButton;
  var confirmButton;

  var enterConfirmationState = () => {
    select.disabled = true;
    message.value = `Are you sure you want to permanently delete preset "${select.value}"?`;
    deleteButton.className = "hidden";
    confirmButton.className = "";
  };

  var enterDeleteState = () => {
    select.disabled = false;
    message.value = defaultMessage;
    deleteButton.className = "";
    confirmButton.className = "hidden";
  };

  var modalJsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Delete Preset"
      },
      {
        tag: "select",
        callback: (element) => select = element
      },
      {
        tag: "div",
        children: {
          tag: "output",
          value: defaultMessage,
          callback: (element) => message = element
        }
      },
      {
        tag: "button",
        text: "Delete",
        callback: (element) => {
          deleteButton = element;
          element.onclick = enterConfirmationState;
        }
      },
      {
        tag: "button",
        text: "Confirm Delete",
        className: "hidden",
        callback: (element) => {
          confirmButton = element;
          element.onclick = () => {
            channels.deletePreset(select.value);
            container.className = "hidden";
            enterDeleteState();
          };
        }

      },
      {
        tag: "button",
        text: "Cancel",
        callback: (element) =>
          element.onclick = () => {
            container.className = "hidden";
            enterDeleteState();
          }
      }
    ]
  };

  var populatePresets = (presets) => {
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

    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    jsmlParse(jsml, select);
  };

  var open = () => container.className = "modalWindow";

  return {
    jsml: modalJsml,
    open,
    populatePresets
  };
};
