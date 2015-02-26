var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var inputElements = [];
  var outputElements = [];

  var createRangeControl = function (parentDomEl, type, min, max, step) {
    var channel = type;
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
            value: model.getModel()[type],
            callback: (element) => {
              input = element;
              inputElements.push({
                element,
                type
              });
              element.oninput = () => {
                channels[channel](input.value);
                output.value = formatOutput(input.value);
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
                type
              });
              element.value = formatOutput(input.value);
            }
          }
        }
      ]
    };
    jsmlParse(jsml, parentDomEl);
  };

var connect = (parentDomEl) => {
  var table = document.createElement("table");

  jsmlParse({
    tag: "thead",
    children: {
      tag: "tr",
      children: {
        tag: "th",
        text: "Filter",
        colspan: 2
      }
    }
  }, table);
  createRangeControl(table, "frequency", 30, 12000);
  createRangeControl(table, "q", 0.0001, 1000);

  var container = document.createElement("div");

  container.className = "center";
  container.appendChild(table);
  parentDomEl.appendChild(container);
};


var render = () => {
  inputElements.forEach((element) => {
    element.element.value = model.getModel()[element.type];
  });
  outputElements.forEach((element) => {
    element.element.value = formatOutput(model.getModel()[element.type]) ;
  });
};


return {
  connect,
  render
};
};
