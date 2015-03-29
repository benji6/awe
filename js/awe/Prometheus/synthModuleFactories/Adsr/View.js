const jsmlParse = require('jsml-parse');
const R = require('ramda');
var createRangeControl = require('../../../Components/createRangeControl.js');

var formatOutput = function (output) {
  return (+output).toFixed(2);
};

module.exports = function (model, channels) {
  var components = null;

  var connect = function (parentDomEl) {
    var table = document.createElement("table");

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: "ADSR",
          colspan: 2
        }
      }
    }, table);

    var componentParams = {
      parent: table,
      name: "a",
      min: 0,
      max: 1,
      observer: channels,
      model: model
    };

    components = [
      createRangeControl(componentParams),
      createRangeControl(R.merge(componentParams, {
        name: "d"
      })),
      createRangeControl(R.merge(componentParams, {
        name: "s"
      })),
      createRangeControl(R.merge(componentParams, {
        name: "r"
      }))
    ];

    var container = document.createElement("div");

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };

  return {
    connect: connect,
    render: function () {
      components.forEach(function (component) {
        component.render();
      });
    }
  };
};
