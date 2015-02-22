var jsmlParse = require('../../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var container = null;
  var input = null;
  var message = null;

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
        callback: (element) =>
          element.onclick = () => {
            var response = channels.savePresetAs(input.value);

            if (response) {
              message.value = response;
              return;
            }
            container.className = "hidden";
            message.value = '';
          }
      },
      {
        tag: "button",
        text: "Cancel",
        callback: (element) =>
          element.onclick = () => {
            container.className = "hidden";
            message.value = '';
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
