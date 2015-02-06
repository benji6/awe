var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var synthViewHolder;

var jsml = {
  "tag": "div",
  "callback": (element) => {
    synthViewHolder = element;
  }
};

module.exports = {
  init: (parentDomEl) => {
    jsmlParse(jsml, parentDomEl);
    return synthViewHolder;
  },
  render: () => {
    // inputElements.forEach((element) => {
    //   element.element.value = model.currentSettings[element.type][element.wave];
    // });
    // outputElements.forEach((element) => {
    //   element.element.value = model.currentSettings[element.type][element.wave];
    // });
  }
};
