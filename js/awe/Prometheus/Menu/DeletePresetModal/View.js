var jsmlParse = require('jsml-parse');

module.exports = function (model, channels) {
  var container = null;
  var select = null;
  var message = null;
  var defaultMessage = "Permanently delete preset";
  var deleteButton;
  var confirmButton;

  var enterConfirmationState = function () {
    select.disabled = true;
    message.value = `Are you sure you want to permanently delete preset "${select.value}"?`;
    deleteButton.className = "hidden";
    confirmButton.className = "";
  };

  var enterDeleteState = function () {
    select.disabled = false;
    message.value = defaultMessage;
    deleteButton.className = "";
    confirmButton.className = "hidden";
  };

  var modalJsml = {
    tag: "div",
    className: "hidden",
    callback: function (element) {
      container = element;
    },
    children: [
      {
        tag: "h3",
        text: "Delete Preset"
      },
      {
        tag: "select",
        callback: function (element) {
          select = element;
        }
      },
      {
        tag: "div",
        className: "margin",
        children: {
          tag: "output",
          value: defaultMessage,
          callback: function (element) {
            message = element;
          }
        }
      },
      {
        tag: "button",
        text: "Delete",
        callback: function (element) {
          deleteButton = element;
          element.onclick = function () {
            if (select.value === '') {
              return;
            }
            enterConfirmationState();
          };
        }
      },
      {
        tag: "button",
        text: "Confirm Delete",
        className: "hidden",
        callback: function (element) {
          confirmButton = element;
          element.onclick = function () {
            channels.deletePreset(select.value);
            container.className = "hidden";
            enterDeleteState();
          };
        }

      },
      {
        tag: "button",
        text: "Cancel",
        callback: function (element) {
          element.onclick = function () {
            container.className = "hidden";
            enterDeleteState();
          };
        }
      }
    ]
  };

  var populatePresets = function (presets) {
    var jsml = null;

    if (presets && presets.length) {
      jsml = presets.map(function (preset) {
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

  var open = function () {
    return container.className = "modalWindow";
  };

  return {
    jsml: modalJsml,
    open: open,
    populatePresets: populatePresets
  };
};
