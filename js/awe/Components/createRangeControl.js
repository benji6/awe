var jsmlParse = require('jsml-parse');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = function (params) {
  var input = null;
  var output = null;
  var modelValue = params.model.getModel()[params.name];

  var render = () => {
    output.value = formatOutput(
      input.value = params.model.getModel()[params.name]
    );
  };

  var jsml = {
    tag: "tr",
    children: [
      {
        tag: "td",
        text: capitalizeFirst(params.name)
      },
      {
        tag: "td",
        children: {
          tag: "input",
          type: "range",
          max: params.max,
          min: params.min,
          step: params.step || (params.max - params.min) / 100,
          value: modelValue,
          callback: (element) => {
            input = element;
            element.oninput = () => {
              params.observer[params.name](input.value);
              output.value = formatOutput(input.value);
            };
          }
        }
      },
      {
        tag: "td",
        children: {
          tag: "output",
          value: formatOutput(modelValue),
          callback: (element) => output = element
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);

  return render;
};
