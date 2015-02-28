var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');
var createRangeControl = require('../../Components/createRangeControl.js');
var extend = require('../../utils/extend.js');

var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var inputElements = [];
  var outputElements = [];
  var ioObj = null;

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

    var componentParams = {
      parent: table,
      name: "volume",
      min: 0,
      max: 1,
      observer: channels,
      model
    };
    ioObj = createRangeControl(componentParams);
    inputElements.push(ioObj.input);
    outputElements.push(ioObj.output);

    ioObj = createRangeControl(extend({
      name: "panning",
      max: 1,
      min: -1
    }, componentParams));
    inputElements.push(ioObj.input);
    outputElements.push(ioObj.output);

    var container = document.createElement("div");

    container.className = "center";
    container.appendChild(table);
    parentDomEl.appendChild(container);
  };

  var render = () => {
    inputElements.forEach((element) => {
      element.input.value = model.getModel()[element.name];
    });
    outputElements.forEach((element) => {
      element.output.value = formatOutput(model.getModel()[element.name]) ;
    });
  };


  return {
    connectTo,
    render
  };
};
