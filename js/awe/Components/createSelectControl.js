const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

const capitalizeFirst = (str) => R.concat(R.toUpper(R.nthChar(0, str)), R.slice(1, R.length(str), str));

module.exports = (params) => {
  const modelType = params.model.type;

  const select = params.parent.appendChild(createElement(h("tr", [
    h("td", capitalizeFirst(params.name)),
  ]))).appendChild(createElement(h("td"))).appendChild(createElement(h("select", {onchange: () =>
    params.observer[params.name](select.value)}, R.map((option) => {
    if (params.name === modelType) {
      return h("option", {
        selected: true
      }, option);
    }
    return h("option", option);
  } ,params.options))));
};
