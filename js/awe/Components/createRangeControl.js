var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = function (params) {
  var input = null;
  var output = null;

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
          value: params.model.getModel()[params.name],
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
          callback: (element) => {
            output = element;
            element.value = formatOutput(input.value);
          }
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);
};
