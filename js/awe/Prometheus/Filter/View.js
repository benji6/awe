var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');
var extend = require('../../utils/extend.js');

var createRangeControl = require('../../Components/createRangeControl.js');
var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var inputElements = [];
  var outputElements = [];

  var createSelectControl = function (parentDomEl, type, options) {
    var createOptions = () => {
      var types = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
      var modelType = model.getModel().type;
      return types.map((type) => {
        jsmlChild = {
          tag: "option",
          text: type,
          value: type
        };

        if (type === modelType) {
          jsmlChild.selected = true;
        }

        return jsmlChild;
      });
    };

    var channel = type;
    var input;
    var jsml = {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: capitalizeFirst(type)
        },
        {
          tag: "td",
          children: {
            tag: "select",
            children: createOptions(),
            callback: (element) => {
              input = element;
              inputElements.push({
                element,
                type
              });
              element.oninput = () => {
                channels[channel](input.value);
                output.value = formatOutput(input.value);
              };
            }
          }
        }
      ]
    };
  jsmlParse(jsml, parentDomEl);
  };

  var connect = (parentDomEl) => {
    var table = document.createElement("table");

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: "Filter",
          colspan: 2
        }
      }
    }, table);

    createSelectControl(table, "type", ["lowpass"]);

    var componentParams = {
      observer: channels,
      parent: table,
      name: "frequency",
      max: 12000,
      min: 30,
      model
    };

    createRangeControl(componentParams);
    createRangeControl(
      extend({
        max: 1000,
        min: 0.0001,
        name: "q"
      }, componentParams));

    var container = document.createElement("div");

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };


  var render = () => {
    inputElements.forEach((element) => {
      element.element.value = model.getModel()[element.type];
    });
    outputElements.forEach((element) => {
      element.element.value = formatOutput(model.getModel()[element.type]) ;
    });
  };


  return {
    connect,
    render
  };
};
