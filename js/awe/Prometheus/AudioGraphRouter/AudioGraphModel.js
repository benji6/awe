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
      connections: [2]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2]
    },
    {
      params: "square",
      type: "oscillator",
      connections: [2]
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
