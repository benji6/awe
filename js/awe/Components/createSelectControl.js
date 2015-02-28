var jsmlParse = require('jsml-parse');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = function (params) {
  var modelType = params.model.getModel().type;
  var select;

  var createOptions = () => {
    return params.options.map((option) => {
      jsmlChild = {
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
          callback: (element) => {
            select = element;
            element.oninput = () => {
              params.observer[params.name](select.value);
            };
          }
        }
      }
    ]
  };
  jsmlParse(jsml, params.parent);

  var render = () => {
    select.value = params.model.getModel()[params.name];
  };

  return render;
};
