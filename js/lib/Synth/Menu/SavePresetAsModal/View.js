var jsmlParse = require('../../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var container = null;
  var input = null;

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
        callback: (element) => input = element
      },
      {
        tag: "button",
        text: "Save",
        callback: (element) =>
          element.onclick = () =>
            channels.savePresetAs(input.value)
      },
      {
        tag: "button",
        text: "Cancel",
        callback: (element) =>
          element.onclick = () =>
            container.className = "hidden"
      }
    ]
  };

  var open = () => container.className = "modalWindow";

  return {
    jsml,
    open
  };
};
