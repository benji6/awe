var createRangeControl = require('../../Components/createRangeControl.js');

module.exports = function (model, channels) {
  var component = null;

  var connectTo = function (parentDomEl) {
    var component = createRangeControl({
      parent: parent,
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
    connectTo,
    render
  };
};
