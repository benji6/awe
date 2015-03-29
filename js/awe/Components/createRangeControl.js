var jsmlParse = require('jsml-parse');
const PRECISION = 12;

var capitalizeFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var formatOutput = function (output) {
  return (+output).toFixed(2);
};

var log12 = function (x) {
  return Math.log(x) / Math.log(12);
};

var exp12 = function (x) {
  return Math.pow(12, x);
};

var maybe = function (callback) {
  return function (boo) {
    return function (x) {
      if (boo) {
        return +callback(x).toPrecision(PRECISION);
      }
      return x;
    };
  };
};

module.exports = function (params) {
  var input = null;
  var output = null;
  var rootNode = null;
  var maybeExp = maybe(exp12)(params.logarithmic);
  var maybeLog = maybe(log12)(params.logarithmic);
  var max = maybeLog(params.max);
  var min = maybeLog(params.min);

  var modelValue = maybeLog(params.model[params.name]);

  var render = function () {
    var modelValue = params.model[params.name];
    input.value = maybeLog(modelValue);
    output.value = formatOutput(modelValue);
  };

  var oninputCallback = function (inputValue) {
    var processedValue = maybeExp(inputValue);

    params.observer[params.name](processedValue);
    output.value = formatOutput(processedValue);
  };

  var jsml = {
    tag: "tr",
    callback: function (element) {
      rootNode = element;
    },
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
          callback: function (element) {
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
          callback: function (element) {
            output = element;
          }
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);

  return {
    render: render,
    rootNode: rootNode
  };
};
