var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var model = require('./model.js');
var pubsub = require('./pubsub.js');

var table;

var save = () => pubsub.emit("save");
var load = () => pubsub.emit("load");
var reset = () => pubsub.emit("reset");

jsmlParse({
  tag: "div",
  id: "synthViewHolder",
  children: [{
    tag: "table",
    callback: (element) => table = element
  },
  {
    tag: "button",
    text: "Save",
    callback: (element) => element.onclick = save
  },
  {
    tag: "button",
    text: "Load",
    callback: (element) => element.onclick = load
  },
  {
    tag: "button",
    text: "Reset",
    callback: (element) => element.onclick = reset
  }]
}, document.body);

var capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

window.inputElements = new Set();
window.outputElements = new Set();

var createRangeControl = function (wave, type, min, max) {
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
          inputElements.add({
            element: element,
            type: type,
            wave: wave
          });
          element.type = "range";
          element.min = min;
          element.max = max;
          element.step = (max - min) / 100;
          element.value = model[type][wave];
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
            element: element,
            type: type,
            wave: wave
          });
          element.value = input.value;
        }
      }
    }]
  };
  jsmlParse(jsml, table);
};

var waves = new Set(["sine", "square", "sawtooth", "triangle"]);

createRangeControl("master", "volume", 0, 1);
waves.forEach((elem) => {
  createRangeControl(elem, "volume", 0, 1);
  createRangeControl(elem, "detune", -100, 100);
});

module.exports = {
  render: () => {
    inputElements.forEach((element) => {
      element.element.value = model[element.type][element.wave];
    });
    outputElements.forEach((element) => {
      element.element.value = model[element.type][element.wave];
    });
  }
};
