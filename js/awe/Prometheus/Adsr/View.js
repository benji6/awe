var jsmlParse = require('jsml-parse');
var createRangeControl = require('../../Components/createRangeControl.js');
var extend = require('../../utils/extend.js');

var formatOutput = function (output) {
  return (+output).toFixed(2);
};

module.exports = function (model, channels) {
  var components = null;

  var connectTo = function (parentDomEl) {
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
      model
    };

    components = [
      createRangeControl(componentParams),
      createRangeControl(extend({
        name: "d"
      }, componentParams)),
      createRangeControl(extend({
        name: "s"
      }, componentParams)),
      createRangeControl(extend({
        name: "r"
      }, componentParams))
    ];

    var container = document.createElement("div");

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };

  return {
    connectTo,
    render: function () {
      components.forEach(function (component) {
        component.render();
      });
    }
  };
};
