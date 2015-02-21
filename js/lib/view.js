var jsmlParse = require('../../custom_modules/jsml/jsmlParse.js');

var jsml = {
  tag: "h1",
  text: "Awe"
};

var metaView = document.createElement("div");

metaView.className = "Awe";
document.body.appendChild(metaView);
jsmlParse(jsml, metaView);

module.exports = {
  destinationView: metaView
};
