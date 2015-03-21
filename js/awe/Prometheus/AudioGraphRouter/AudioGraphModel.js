var createDefaultModel = function () {
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
      params: "square",
      type: "oscillator",
      connections: {
        2: "input"
      },
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: {
        2: "input"
      },
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: {
        2: "input"
      },
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: {
        2: "input"
      },
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
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
