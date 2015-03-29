var jsmlParse = require('jsml-parse');

module.exports = function (model, channels) {
  var container = null;
  var select = null;

  var modalJsml = {
    tag: "div",
    className: "hidden",
    callback: function (element) {
      container = element;
    },
    children: [
      {
        tag: "h3",
        text: "Open Preset"
      },
      {
        tag: "select",
        callback: function (element) {
          select = element;
        }
      },
      {
        tag: "button",
        text: "Open",
        callback: function (element) {
          element.onclick = function () {
            channels.openPreset(select.value);
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
    container.className = "modalWindow";
  };

  return {
    jsml: modalJsml,
    open: open,
    populatePresets: populatePresets
  };
};
