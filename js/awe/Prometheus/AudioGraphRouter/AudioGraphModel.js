var createDefaultModel = function () {
  return [
    {
      type: "gain"
    },
    {
      type: "stereoPanner",
      connections: [0]
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
    model,
    init,
    setModel
  };
};
