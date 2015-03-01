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
      max: 15000,
      min: 10,
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
        min: 0,
        name: "q"
      }, componentParams))
    ];

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };

  return {
    connect,
    render: () => components.forEach((render) => render())
  };
};
