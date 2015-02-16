var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');


module.exports = (pubsub) => {
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
      element.onclick = () => pubsub.pub(buttonLabels[count].toLowerCase());
    }
  },
{
  tag: "input",
  callback: (element) => pubsub.sub('import', () => {
    pubsub.pub("importdata", element.value);
    element.value = "";
  })
}
]
};

  return {
    connectTo: (parentDomElement) => {
      jsmlParse(jsml, parentDomElement);
    }
  };
};
