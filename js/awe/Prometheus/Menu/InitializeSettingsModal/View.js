var jsmlParse = require('jsml-parse');

module.exports = function (channels) {
  var container = null;
  var input = null;

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Initialize Settngs"
      },
      {
        tag: "p",
        text: "Are you sure? All unsaved settings will be lost!"
      },
      {
        tag: "button",
        text: "Initialize",
        callback: (element) =>
          element.onclick = () => {
            channels.initialize();
            container.className = "hidden";
          }
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
