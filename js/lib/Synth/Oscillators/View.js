var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var inputElements = [];
  var outputElements = [];

  var createRangeControl = function (parentDomEl, wave, type, min, max, step) {
    var channel = wave + capitalizeFirst(type);
    var input;
    var output;
    var jsml = {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: capitalizeFirst(type)
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
              inputElements.push({
                element,
                type,
                wave
              });
              element.oninput = () => {
                channels[channel](element.value);
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
              outputElements.push({
                element,
                type,
                wave
              });
              element.value = formatOutput(input.value);
            }
          }
        }
      ]
    };

    jsmlParse(jsml, parentDomEl);
  };

var connectTo = (parentDomEl) => {
  var tables = [];
  var waves = ["sawtooth", "sine", "square", "triangle"];
  var controls = [
    ["volume", 0, 1],
    ["panning", -1, 1],
    ["tune", -36, 36, 1],
    ["detune", -100, 100],
  ];

    waves.forEach((wave) => {
      var table = document.createElement("table");
      jsmlParse({
        tag: "thead",
        children: {
          tag: "tr",
          children: {
            tag: "th",
            text: capitalizeFirst(wave),
            colspan: 2
          }
        }
      }, table);
      controls.forEach((control) => {
        createRangeControl(table, wave, control[0], control[1], control[2], control[3]);
      });
      tables.push(table);
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

  return {
    connectTo,
    render
  };
};
