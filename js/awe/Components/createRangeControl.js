const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

const PRECISION = 12;

const capitalizeFirst = (str) => R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));
const formatOutput = (output) => Number(output).toFixed(2);
const log12 = (x) => Math.log(x) / Math.log(12);
const exp12 = (x) => Math.pow(12, x);

const maybe = (callback) => (boo) => (x) => {
    if (boo) {
      return Number(callback(x)).toPrecision(PRECISION);
    }
    return x;
  };

module.exports = (params) => {
  const maybeExp = maybe(exp12)(params.logarithmic);
  const maybeLog = maybe(log12)(params.logarithmic);

  const rootNode = createElement(h("tr"));

  params.parent
    .appendChild(rootNode)
    .appendChild(createElement(h("td", capitalizeFirst(params.name))));

  const input = rootNode.appendChild(createElement(h("td", [
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
  ])));

  const output = rootNode.appendChild(createElement(h("tr"))
    .appendChild(createElement(h("td"))))
    .appendChild(createElement(h("output", {
      value: formatOutput(maybeExp(maybeLog(params.model[params.name])))
    })));

  const render = () => {
    const modelValue = params.model[params.name];
    input.value = maybeLog(modelValue);
    output.value = formatOutput(modelValue);
  };

  const oninputCallback = (inputValue) => {
    params.observer[params.name](maybeExp(inputValue));
    output.value = formatOutput(maybeExp(inputValue));
  };

  return {
    render,
    rootNode
  };
};
