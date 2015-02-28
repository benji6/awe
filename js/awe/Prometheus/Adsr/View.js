var jsmlParse = require('jsml-parse');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = (model, channels) => {
  var inputElements = [];
  var outputElements = [];

  var formatOutput = (output) => (+output).toFixed(2);

  var createRangeControl = function (parentDomEl, type, min, max, step) {
    var channel = "adsr" + capitalizeFirst(type);
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

  var connectTo = (parentDomEl) => {
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
    createRangeControl(table, "a", 0, 1);
    createRangeControl(table, "d", 0, 1);
    createRangeControl(table, "s", 0, 1);
    createRangeControl(table, "r", 0, 1);

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
    connectTo,
    render
  };
};
