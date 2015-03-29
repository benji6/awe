var jsmlParse = require('jsml-parse');

module.exports = function (channels) {
  var container = null;
  var input = null;

  var jsml = {
    tag: "div",
    className: "hidden",
    callback: function (element) {
      container = element;
    },
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
        callback: function (element) {
          element.onclick = function () {
            channels.initialize();
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
