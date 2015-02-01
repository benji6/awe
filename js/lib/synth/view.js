var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var pubsub = require('./pubsub.js');

var table = document.createElement('table');
document.body.appendChild(table);

var createRangeControl = function (text, type) {
  var channel = text + type;
  var input;
  var output;
  var jsml = {
    tag: "tr",
    children: [{
      tag: "td",
      text: text.charAt(0).toUpperCase() + text.slice(1) + " " + type
    },
    {
      tag: "td",
      children: {
        tag: "input",
        callback: (element) => {
          input = element;
          element.type = "range";
          element.min = 0;
          element.max = 1;
          element.step = 0.01;
          element.value = 0.1;
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
  createRangeControl("master", "Volume");

  var waves = new Set(["sine", "square", "sawtooth", "triangle"]);

  waves.forEach((elem) => {
    createRangeControl(elem, "Volume");
    createRangeControl(elem, "Detune");
  });
};
