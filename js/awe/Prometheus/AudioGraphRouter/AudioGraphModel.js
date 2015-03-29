const R = require('ramda');

var createDefaultModel = function () {
  var eventListeners = [
    "noteStart",
    "noteFinish"
  ];

  var model = [
    {
      type: "gain"
    },
    {

      type: "stereoPanner",
      connections: {
        0: "input"
      }
    },
    {
      type: "filter",
      connections: {
        1: "input"
      }
    },
    {
      connections: {
        2: "input"
      },
      eventListeners: eventListeners,
      inputs: {
        gain: 7
      },
      params: "square",
      type: "oscillator"
    },
    {
      connections: {
        2: "input"
      },
      eventListeners: eventListeners,
      inputs: {
        gain: 7
      },
      params: "square",
      type: "oscillator"
    },
    {
      connections: {
        2: "input"
      },
      eventListeners: eventListeners,
      inputs: {
        gain: 7
      },
      params: "square",
      type: "oscillator"
    },
    {
      connections: {
        2: "input"
      },
      eventListeners: eventListeners,
      inputs: {
        gain: 7
      },
      params: "square",
      type: "oscillator"
    },
    {
      type: "adsr"
    }
  ];

  return R.mapIndexed(function (obj, index) {
    obj.id = index;
    return obj;
  }, model);
};

module.exports = function (controller) {
  var model = createDefaultModel();

  var setModel = function (newModel) {
    model = newModel;
  };

  var init = function () {
    setModel(createDefaultModel());
  };

  return {
    init: init,
    model: model,
    setModel: setModel
  };
};
