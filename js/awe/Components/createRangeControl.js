var jsmlParse = require('jsml-parse');
const PRECISION = 8;
var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

var maybe = function (callback) {
  return function (boo) {
    return function (x) {
      if (boo) {
        return callback(x).toPrecision(PRECISION);
      }
      return x;
    };
  };
};

module.exports = function (params) {
  var input = null;
  var output = null;

  var max = (params.logarithmic ? Math.log(params.max) : params.max).toPrecision(PRECISION);
  var min = (params.logarithmic ? Math.log(params.min) : params.min).toPrecision(PRECISION);
  var maybeExp = maybe(Math.exp)(params.logarithmic);
  var maybeLn = maybe(Math.log)(params.logarithmic);
  var modelValue = maybeLn(params.model.getModel()[params.name]);

  var render = () => {
    var modelValue = params.model.getModel()[params.name];
    input.value = maybeLn(modelValue);
    output.value = formatOutput(modelValue);
  };

  var oninputCallback = function (inputValue) {
    var processedValue = maybeExp(inputValue);

    params.observer[params.name](processedValue);
    output.value = formatOutput(processedValue);
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
          max: max,
          min: min,
          step: (params.step || (max - min) / 100).toPrecision(PRECISION),
          value: modelValue,
          callback: (element) => {
            input = element;
            element.oninput = function () {
              oninputCallback(input.value);
            };
          }
        }
      },
      {
        tag: "td",
        children: {
          tag: "output",
          value: formatOutput(maybeExp(modelValue)),
          callback: (element) => output = element
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);

  return render;
};
