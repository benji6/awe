const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

const capitalizeFirst = function (str) {
  return R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));
};

module.exports = function (params) {
  const modelType = params.model.type;

  const select = params.parent.appendChild(createElement(h("tr", [
    h("td", capitalizeFirst(params.name)),
  ]))).appendChild(createElement(h("td"))).appendChild(createElement(h("select", onchange = function () {
    params.observer[params.name](select.value);
  }, R.map(function (option) {
    if (params.name === modelType) {
      return h("option", {
        selected: true
      }, option);
    }
    return h("option", option);
  } ,params.options))));
};
