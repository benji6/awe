var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var pubsub = require('../pubsub.js');
var model = require('./model.js');

var capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

var inputElements = new Set();
var outputElements = new Set();

var createRangeControl = function (parentDomEl, type, min, max, step) {
  var channel = "master" + capitaliseFirst(type);
  var input;
  var output;
  var jsml = {
    tag: "tr",
    children: [
      {
        tag: "td",
        text: "Master " + type
      },
      {
        tag: "td",
        children: {
          tag: "input",
          type: "range",
          min,
          max,
          step: step || (max - min) / 100,
          value: model[type],
          callback: (element) => {
            input = element;
            inputElements.add({
              element,
              type
            });
            element.oninput = () => {
              pubsub.emit(channel, input.value);
              output.value = input.value;
            };
          }
        }
      },
      {
        tag: "td",
        children: {
          tag: "output",
          callback: (element) => {
            output = element;
            outputElements.add({
              element,
              type
            });
            element.value = input.value;
          }
        }
      }
    ]
  };
  jsmlParse(jsml, parentDomEl);
};

module.exports = {
  connect: (parentDomEl) => {
    createRangeControl(parentDomEl, "volume", 0, 1);
    createRangeControl(parentDomEl, "panning", -1, 1);
  },
  render: () => {
    inputElements.forEach((element) => {
      element.element.value = model[element.type];
    });
    outputElements.forEach((element) => {
      element.element.value = model[element.type];
    });
  }
};
