var jsmlParse = require('jsml-parse');

module.exports = function (channels) {
  var container = null;
  var input = null;
  var message = null;
  var defaultMessage = "Warning: any unsaved settings will be lost";

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: function (element) {
      container = element;
    },
    children: [
      {
        tag: "h3",
        text: "Import Settings"
      },
      {
        tag: "input",
        placeholder: "Paste preset data here",
        callback: function (element) {
          input = element;
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
        text: "Import",
        callback: function (element) {
          element.onclick = function () {
            var response = channels.importPreset(input.value);

            if (response) {
              message.value = response;
              return;
            }
            container.className = "hidden";
            message.value = defaultMessage;
            input.value = '';
          };
        }
      },
      {
        tag: "button",
        text: "Cancel",
        callback: function (element) {
          element.onclick = function () {
            container.className = "hidden";
            message.value = defaultMessage;
          };
        }
      }
    ]
  };

  var open = function () {
    container.className = "modalWindow";
  };

  return {
    jsml: jsml,
    open: open
  };
};
