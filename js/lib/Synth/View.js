var jsmlParse = require('../../../custom_modules/jsml/jsmlParse.js');

var synthViewHolder = null;

module.exports = (pluginName) => {
  var jsml = {
    tag: "div",
    className: pluginName,
    callback: (element) => {
      synthViewHolder = element;
    },
    children: {
      tag: "div",
      className: "center",
      children: {
        tag: "h2",
        text: pluginName
      }
    }
  };

  return {
    connectViewTo: (parentDomEl) => {
      jsmlParse(jsml, parentDomEl);
      return synthViewHolder;
    }
  };
};
