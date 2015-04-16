const h = require('virtual-dom/h');
const R = require('ramda');

const capitalizeFirst = (str) => R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));

module.exports = ({name, model, observer, options}) => h("tr", [
  h("td", capitalizeFirst(name)),
  h("td", h("select", {
    onchange: function () {
      observer[name](this.value);
    }
  }, R.map((value) => R.eq(value, model.type) ?
      h("option", {
          selected: true,
          value
      }, capitalizeFirst(value)) :
      h("option", {
        value
      }, capitalizeFirst(value)), options)))
]);
