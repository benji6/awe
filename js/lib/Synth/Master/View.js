var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var formatOutput = (output) => (+output).toFixed(2);


module.exports = (model, channels) => {
  var inputElements = new Set();
  var outputElements = new Set();

  var createRangeControl = function (parentDomEl, type, min, max, step) {
    var channel = "master" + capitalizeFirst(type);
    var input;
    var output;
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
        tag: "input",
        type: "range",
        min,
        max,
        step: step || (max - min) / 100,
        value: model.getModel()[type],
        callback: (element) => {
          input = element;
          inputElements.add({
            element,
            type
          });
          element.oninput = () => {
            channels[channel](input.value);
            output.value = formatOutput(input.value);
          };
        }
      }
    },
  {
    tag: "td",
    children: {
      tag: "output",
      callback: (element) => {
        output = element;
        outputElements.add({
          element,
          type
        });
        element.value = formatOutput(input.value);
      }
    }
  }
  ]
};
jsmlParse(jsml, parentDomEl);
};

  var connectTo = (parentDomEl) => {
    var table = document.createElement("table");

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: "Master",
          colspan: 2
        }
      }
    }, table);
    createRangeControl(table, "volume", 0, 1);
    createRangeControl(table, "panning", -1, 1);
    parentDomEl.appendChild(table);
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
    connectTo,
    render
  };
};
