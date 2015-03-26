var createDefaultModel = function () {
  var eventListeners = [
    "noteStart",
    "noteFinish"
  ];

  return [
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
      eventListeners,
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
      eventListeners,
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
      eventListeners,
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
      eventListeners,
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
    init,
    model,
    setModel
  };
};
