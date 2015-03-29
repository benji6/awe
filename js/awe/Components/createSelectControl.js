var jsmlParse = require('jsml-parse');
const R = require('ramda');

const capitalizeFirst = function (str) {
  return R.concat(R.toUpper(R.charAt(0, str)), R.slice(1, R.length(str), str));
};

module.exports = function (params) {
  var modelType = params.model.type;
  var select;

  var render = function () {
    var modelParam = params.model[params.name];
    var options = select.children;

    for (var i = 0; i < options.length; i++) {
      if (options[i].value === modelParam) {
        options[i].selected = true;
      } else {
        options[i].selected = false;
      }
    }
  };

  var createOptions = function () {
    return params.options.map(function (option) {
      var jsmlChild = {
        tag: "option",
        text: option,
        value: option
      };

      if (params.name === modelType) {
        jsmlChild.selected = true;
      }

      return jsmlChild;
    });
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
          tag: "select",
          children: createOptions(),
          callback: function (element) {
            select = element;
            element.onchange = function () {
              params.observer[params.name](select.value);
            };
          }
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);


  return {
    render: render
  };
};
