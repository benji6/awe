var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var pubsub = require('./pubsub.js');

var table = document.createElement('table');
document.body.appendChild(table);

var createVolumeControl = function (text) {
  var channel = text + "Volume";
  var input;
  var output;
  var jsml = {
    tag: "tr",
    children: [{
      tag: "td",
      text: text + " volume"
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
  createVolumeControl('master');
  createVolumeControl('sine');
  createVolumeControl('square');
  createVolumeControl('sawtooth');
  createVolumeControl('triangle');
};
