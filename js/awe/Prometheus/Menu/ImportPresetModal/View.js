var jsmlParse = require('jsml-parse');

module.exports = function (channels) {
  var container = null;
  var input = null;
  var message = null;
  var defaultMessage = "Warning: any unsaved settings will be lost";

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Import Settings"
      },
      {
        tag: "input",
        placeholder: "Paste preset data here",
        callback: (element) => input = element
      },
      {
        tag: "div",
        className: "margin",
        children: {
          tag: "output",
          value: defaultMessage,
          callback: (element) => message = element
        }
      },
      {
        tag: "button",
        text: "Import",
        callback: (element) =>
          element.onclick = () => {
            var response = channels.importPreset(input.value);

            if (response) {
              message.value = response;
              return;
            }
            container.className = "hidden";
            message.value = defaultMessage;
            input.value = '';
          }
      },
      {
        tag: "button",
        text: "Cancel",
        callback: (element) =>
          element.onclick = () => {
            container.className = "hidden";
            message.value = defaultMessage;
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
