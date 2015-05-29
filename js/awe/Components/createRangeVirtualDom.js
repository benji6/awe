const h = require('virtual-dom/h');
const R = require('ramda');

const PRECISION = 12;

const capitalizeFirst = (str) => R.concat(R.toUpper(R.nthChar(0, str)), R.slice(1, R.length(str), str));
const formatOutput = (output) => Number(output).toFixed(2);
const log12 = (x) => Math.log(x) / Math.log(12);
const exp12 = (x) => Math.pow(12, x);

const maybe = (callback) => (boo) => (x) => boo ? Number(callback(x)).toPrecision(PRECISION) : x;

module.exports = ({isLogarithmic, name, observer, max, min, step, model}) => {
  const maybeExp = maybe(exp12)(isLogarithmic);
  const maybeLog = maybe(log12)(isLogarithmic);

  const oninputCallback = (inputValue) => observer[name](maybeExp(inputValue));

  return h("tr", [
    h("td", capitalizeFirst(name)),
    h("td", [
      h("input", {
        type: "range",
        max: maybeLog(max),
        min: maybeLog(min),
        step: (step || (maybeLog(max) - maybeLog(min)) / 100).toPrecision(PRECISION),
        value: maybeLog(model[name]),
        oninput: function () {
          oninputCallback(this.value);
        }
      })
    ]),
    h("td", h("output", {
      value: formatOutput(maybeExp(maybeLog(model[name])))
    }))
  ]);
};
