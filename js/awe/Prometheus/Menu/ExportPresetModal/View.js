var jsmlParse = require('jsml-parse');

module.exports = function (model, channels) {
  var container = null;
  var input = null;
  var presetDataView = null;

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Current Settings"
      },
      {
        tag: "p",
        text: "Copy and send to a friend!"
      },
      {
        tag: "hr"
      },
      {
        tag: "output",
        callback: (element) => presetDataView = element
      },
      {
        tag: "hr"
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

  var open = () => {
    presetDataView.value = channels.exportPreset();
    container.className = "modalWindow";
  };

  return {
    jsml,
    open
  };
};
