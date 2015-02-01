var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var model = require('./model.js');
var pubsub = require('./pubsub.js');

var table = document.createElement('table');
document.body.appendChild(table);

var capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

var createRangeControl = function (wave, type, min) {
  var channel = wave + capitaliseFirst(type);
  var input;
  var output;
  var jsml = {
    tag: "tr",
    children: [{
      tag: "td",
      text: capitaliseFirst(wave) + " " + type
    },
    {
      tag: "td",
      children: {
        tag: "input",
        callback: (element) => {
          input = element;
          element.type = "range";
          element.min = min;
          element.max = 1;
          element.step = 0.01;
          element.value = model[type][wave];
          element.oninput = function () {
            pubsub.emit(channel, input.value);
            output.value = (input.value * 100).toFixed(0);
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
          element.value = input.value;
        }
      }
    }]
  };
  jsmlParse(jsml, table);
};

module.exports = () => {
  createRangeControl("master", "volume");

  var waves = new Set(["sine", "square", "sawtooth", "triangle"]);

  waves.forEach((elem) => {
    createRangeControl(elem, "volume", 0);
    createRangeControl(elem, "detune", -1);
  });
};
