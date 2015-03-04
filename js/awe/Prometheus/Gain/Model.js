var createDefaultModel = function () {
  return {
    gain: 0.2
  };
};

module.exports = function (controllerChannel) {
  var model = createDefaultModel();

  var setModel = function (newModel) {
    model = newModel;
    controllerChannel.volume(model.volume);
  };

  var init = function () {
    setModel(createDefaultModel());
  };

  var getModel = function () {
    return model;
  };

  return {
    getModel,
    init,
    setModel
  };
};
