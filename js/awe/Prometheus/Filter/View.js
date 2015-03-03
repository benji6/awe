var jsmlParse = require('jsml-parse');
var extend = require('../../utils/extend.js');
var createRangeControl = require('../../Components/createRangeControl.js');
var createSelectControl = require('../../Components/createSelectControl.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var components = null;

  var connect = (parentDomEl) => {
    var container = document.createElement("div");
    var table = document.createElement("table");
    var componentParams = {
      logarithmic: true,
      max: 18000,
      min: 20,
      model,
      name: "frequency",
      observer: channels,
      parent: table
    };

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: "Filter",
          colspan: 2
        }
      }
    }, table);

    components = [
      createSelectControl({
        parent: table,
        model,
        name: "type",
        observer: channels,
        options: [
          "lowpass",
          "highpass",
          "bandpass",
          "lowshelf",
          "highshelf",
          "peaking",
          "notch",
          "allpass"
        ]
      }),
      createRangeControl(componentParams),
      createRangeControl(extend({
        max: 100,
        min: 0.0001,
        name: "q"
      }, componentParams)),
      createRangeControl(extend({
        logarithmic: false,
        max: 36,
        min: -36,
        name: "gain"
      }, componentParams))
    ];

    components[2].rootNode.style.display = controlDisplays.lowpass.q;
    components[3].rootNode.style.display = controlDisplays.lowpass.gain;

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };

  var controlDisplays = {
    lowpass: {
      q: "",
      gain: "none"
    },
    highpass: {
      q: "",
      gain: "none"
    },
    bandpass: {
      q: "",
      gain: "none"
    },
    lowshelf: {
      q: "none",
      gain: ""
    },
    highshelf: {
      q: "none",
      gain: ""
    },
    peaking: {
      q: "",
      gain: ""
    },
    notch: {
      q: "",
      gain: "none"
    },
    allpass: {
      q: "",
      gain: "none"
    }
  };

  return {
    connect,
    render: (type) => {
      components.forEach((component) => component.render());
      if (!type) {
        return;
      }
      components[2].rootNode.style.display = controlDisplays[type].q;
      components[3].rootNode.style.display = controlDisplays[type].gain;
    }
  };
};
