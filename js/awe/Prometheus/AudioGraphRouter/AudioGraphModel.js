var createDefaultModel = function () {
  return [
    {
      type: "gain"
    },
    {
      type: "stereoPanner",
      connections: [0]
    },
    {
      type: "filter",
      connections: [1]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2],
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2],
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2],
      eventListeners: [
        "noteStart",
        "noteFinish"
      ]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2],
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
