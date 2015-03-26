var jsmlParse = require('jsml-parse');
var createRangeControl = require('../../Components/createRangeControl.js');
var extend = require('../../utils/extend.js');

var capitalizeFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var formatOutput = function (output) {
  return Number(output).toFixed(2);
};

module.exports = function (model, channels, type) {
  var components = [];

  var connect = function (parentDomEl) {
    var tables = [];

    var table = document.createElement("table");

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: capitalizeFirst(type),
          colspan: 2
        }
      }
    }, table);

    var componentParams = {
      parent: table,
      name: "volume",
      observer: channels,
      max: 1,
      min: 0,
      model
    };

    components = components.concat([
      createRangeControl(componentParams),
      createRangeControl(extend({
        max: 1,
        min: -1,
        name: "panning"
      }, componentParams)),
      createRangeControl(extend({
        max: 36,
        min: -36,
        name: "tune",
        step: 1
      }, componentParams)),
      createRangeControl(extend({
        max: 100,
        min: -100,
        name: "detune"
      }, componentParams))
    ]);

    tables.push(table);

    tables.forEach(function (table) {
      parentDomEl.appendChild(table);
    });
  };

  return {
    connect,
    render: function () {
      return components.forEach(function (component) {
        return component.render();
      });
    }
  };
};
