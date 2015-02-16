var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');


module.exports = (channels) => {
  var buttonLabels = ["Save", "Load", "Reset", "Export", "Import"];

  var jsml = {
    tag: "div",
    callback: (element) => synthViewHolder = element,
    children: [
  {
    tag: "button",
    count: 5,
    text: (count) => buttonLabels[count],
    callback: function (element, jsmlElement, count) {
      element.onclick = () => channels[buttonLabels[count].toLowerCase()]();
    }
  },
{
  tag: "input",
  callback: (element) => channels.import = () => {
    channels.importdata(element.value);
    element.value = "";
  }
}
]
};

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
    }
  };
};
