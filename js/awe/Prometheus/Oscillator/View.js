var jsmlParse = require('jsml-parse');
var createRangeControl = require('../../Components/createRangeControl.js');
var extend = require('../../utils/extend.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels, type) => {
  var components = [];

  var connect = (parentDomEl) => {
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

    tables.forEach((table) => {
      parentDomEl.appendChild(table);
    });
  };

  return {
    connect,
    render: () => components.forEach((component) => component.render())
  };
};
