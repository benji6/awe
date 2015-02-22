var jsmlParse = require('../../../../../custom_modules/jsml/jsmlParse.js');

module.exports = function (model, channels) {
  var container = null;
  var select = null;

  var modalJsml = {
    tag: "div",
    className: "hidden",
    callback: (element) => container = element,
    children: [
      {
        tag: "h3",
        text: "Open Preset"
      },
      {
        tag: "select",
        callback: (element) => select = element
      },
      {
        tag: "button",
        text: "Open",
        callback: (element) =>
          element.onclick = () =>
            channels.openPreset(select.value)
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

  var populatePresets = () => {
    var presets = model.getPresets();
    var jsml = null;

    if (presets) {
      jsml = presets.map((preset) => {
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

  var open = () => container.className = "modalWindow";

  return {
    jsml: modalJsml,
    open,
    populatePresets
  };
};
