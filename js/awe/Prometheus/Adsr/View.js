var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');
var createRangeControl = require('../../Components/createRangeControl.js');
var extend = require('../../utils/extend.js');

var formatOutput = (output) => (+output).toFixed(2);

module.exports = (model, channels) => {
  var components = [];

  var connectTo = (parentDomEl) => {
    var parent = document.createElement("table");

    jsmlParse({
      tag: "thead",
      children: {
        tag: "tr",
        children: {
          tag: "th",
          text: "ADSR",
          colspan: 2
        }
      }
    }, parent);

    var componentParams = {
      parent: parent,
      name: "a",
      min: 0,
      max: 1,
      observer: channels,
      model
    };

    components.push(createRangeControl(componentParams));
    components.push(createRangeControl(extend({
      name: "d"
    }, componentParams)));
    components.push(createRangeControl(extend({
      name: "s"
    }, componentParams)));
    components.push(createRangeControl(extend({
      name: "r"
    }, componentParams)));

    var container = document.createElement("div");

    container.className = "center";
    container.appendChild(parent);
    parentDomEl.appendChild(container);
  };

  var render = () => {
    components.forEach((component) => {
      component.output.value = formatOutput(
        component.input.value = model.getModel()[component.name]
      );
    });
  };

  return {
    connectTo,
    render
  };
};
