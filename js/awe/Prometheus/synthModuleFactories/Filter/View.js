const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');
var createRangeControl = require('../../../Components/createRangeControl.js');
var createSelectControl = require('../../../Components/createSelectControl.js');

const capitalizeFirst = function (str) {
  return R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));
};

var formatOutput = function (output) {
  (+output).toFixed(2);
};

module.exports = function (model, channels) {
  var components = null;

  var connect = function (parentDomEl) {
    var container = document.createElement("div");
    var table = document.createElement("table");
    var componentParams = {
      logarithmic: true,
      max: 18000,
      min: 20,
      model: model,
      name: "frequency",
      observer: channels,
      parent: table
    };

    table.appendChild(createElement(h("thead", [
      h("tr", [
        h("th", {attributes: {colspan: 2}}, "Filter")
      ])
    ])));

    components = [
      createSelectControl({
        parent: table,
        model: model,
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
      createRangeControl(R.merge(componentParams, {
        max: 100,
        min: 0.0001,
        name: "q"
      })),
      createRangeControl(R.merge(componentParams, {
        logarithmic: false,
        max: 36,
        min: -36,
        name: "gain"
      }))
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
    connect: connect,
    render: function (type) {
      components.forEach(function (component) {
        component.render();
      });
      if (!type) {
        return;
      }
      components[2].rootNode.style.display = controlDisplays[type].q;
      components[3].rootNode.style.display = controlDisplays[type].gain;
    }
  };
};
