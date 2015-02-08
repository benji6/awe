var jsmlParse = require('../../../../custom_modules/jsml/jsmlParse.js');

var save = () => pubsub.emit("save");
var load = () => pubsub.emit("load");
var reset = () => pubsub.emit("reset");

var jsml = {
  tag: "div",
  id: "synthViewHolder",
  callback: (element) => synthViewHolder = element,
  children: [{
    tag: "table",
    callback: (element) => table = element
  },
{
  tag: "button",
  text: "Save",
  callback: (element) => element.onclick = save
},
{
  tag: "button",
  text: "Load",
  callback: (element) => element.onclick = load
},
{
  tag: "button",
  text: "Reset",
  callback: (element) => element.onclick = reset
}]
};

module.exports = {
  connectTo: (parentDomElement) => {
    jsmlParse(jsml, parentDomElement);
  }
};
