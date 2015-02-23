var jsmlParse = require('../../custom_modules/jsml/jsmlParse.js');

var jsml = {
  tag: "div",
  className: "center",
  children: {
    tag: "h1",
    text: "Awe"
  }
};

var aweView = document.createElement("div");
var container = document.createElement("div");

container.className = "center";
aweView.className = "Awe";
container.appendChild(aweView);
document.body.appendChild(container);
jsmlParse(jsml, aweView);

module.exports = {
  destinationView: aweView
};
