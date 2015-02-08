var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var synthViewHolder;

var jsml = {
  tag: "div",
  callback: (element) => {
    synthViewHolder = element;
  }
};

module.exports = {
  connectViewTo: (parentDomEl) => {
    jsmlParse(jsml, parentDomEl);
    return synthViewHolder;
  }
};
