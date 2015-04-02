const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

const PRECISION = 12;

const capitalizeFirst = function (str) {
  return R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));
};

const formatOutput = function (output) {
  return Number(output).toFixed(2);
};

const log12 = function (x) {
  return Math.log(x) / Math.log(12);
};

const exp12 = function (x) {
  return Math.pow(12, x);
};

const maybe = function (callback) {
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
  const maybeExp = maybe(exp12)(params.logarithmic);
  const maybeLog = maybe(log12)(params.logarithmic);

  const rootNode = createElement(h("tr"));

  const label = createElement(h("td", capitalizeFirst(params.name)));
  
  const input = createElement(h("td", [
    h("input", {
      type: "range",
      max: maybeLog(params.max),
      min: maybeLog(params.min),
      step: (params.step || (maybeLog(params.max) - maybeLog(params.min)) / 100).toPrecision(PRECISION),
      value: maybeLog(params.model[params.name]),
      oninput: function () {
        oninputCallback(this.value);
      }
    })
  ]));

  const output = createElement(h("output", {
    value: formatOutput(maybeExp(maybeLog(params.model[params.name])))
  }));

  const render = function () {
    const modelValue = params.model[params.name];
    input.value = maybeLog(modelValue);
    output.value = formatOutput(modelValue);
  };

  const oninputCallback = function (inputValue) {
    params.observer[params.name](maybeExp(inputValue));
    output.value = formatOutput(maybeExp(inputValue));
  };

  params.parent.appendChild(rootNode).appendChild(label);
  rootNode.appendChild(input);
  rootNode.appendChild(createElement(h("tr"))
    .appendChild(createElement(h("td"))))
    .appendChild(output);

  return {
    render: render,
    rootNode: rootNode
  };
};
