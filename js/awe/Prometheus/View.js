var jsmlParse = require('jsml-parse');

var synthViewHolder = null;

module.exports = function (pluginName) {
  var jsml = {
    tag: "div",
    className: pluginName,
    callback: function (element) {
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
    connectViewTo: function (parentDomEl) {
      jsmlParse(jsml, parentDomEl);
      return synthViewHolder;
    }
  };
};
