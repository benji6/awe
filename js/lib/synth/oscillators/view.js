var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var model = require('./model.js');
var pubsub = require('../pubsub.js');

var capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

var inputElements = new Set();
var outputElements = new Set();

var createRangeControl = function (parentDomEl, wave, type, min, max, step) {
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
        type: "range",
        min,
        max,
        step: step || (max - min) / 100,
        value:  model.getModel()[wave][type],
        callback: (element) => {
          input = element;
          inputElements.add({
            element,
            type,
            wave
          });
          element.oninput = () => {
            pubsub.emit(channel, element.value);
            output.value = formatOutput(element.value);
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
            type,
            wave
          });
          element.value = formatOutput(input.value);
        }
      }
    }]
  };

  jsmlParse(jsml, parentDomEl);
};

var connectTo = (parentDomEl) => {
  var tables = new Set();
  var waves = new Set(["sawtooth", "sine", "square", "triangle"]);
  var controls = new Set([
    ["volume", 0, 1],
    ["tune", -36, 36, 1],
    ["detune", -100, 100],
    ["panning", -1, 1],
  ]);

  waves.forEach((wave) => {
    var table = document.createElement("table");
    controls.forEach((control) => {
      createRangeControl(table, wave, control[0], control[1], control[2], control[3]);
    });
    tables.add(table);
  });
  tables.forEach((table) => {
    parentDomEl.appendChild(table);
  });
};

var render = () => {
  inputElements.forEach((element) => {
    element.element.value = model.getModel()[element.wave][element.type];
  });
  outputElements.forEach((element) => {
    element.element.value = formatOutput(model.getModel()[element.wave][element.type]);
  });
};


module.exports = {
  connectTo,
  render
};
