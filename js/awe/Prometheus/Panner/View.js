var createRangeControl = require('../../Components/createRangeControl.js');

module.exports = function (model, channels) {
  var component = null;

  var connect = function (parentDomEl) {
    component = createRangeControl({
      parent: parentDomEl,
      name: "panning",
      min: -1,
      max: 1,
      observer: channels,
      model
    });
  };

  var render = function () {
    component.render();
  };

  return {
    connect,
    render
  };
};
