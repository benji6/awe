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
        text: "Export Preset"
      },
      {
        tag: "button",
        text: "OK",
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
