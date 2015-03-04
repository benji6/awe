var createRangeControl = require('../../Components/createRangeControl.js');

module.exports = function (model, channels) {
  var component = null;

  var connectTo = function (parentDomEl) {
    component = createRangeControl({
      parent: parentDomEl,
      name: "volume",
      min: 0,
      max: 1,
      observer: channels,
      model
    });
  };

  var render = function () {
    component.render();
  };

  return {
    connectTo,
    render
  };
};
