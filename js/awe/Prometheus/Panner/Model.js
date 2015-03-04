var createDefaultModel = function () {
  return {
    panning: 0,
  };
};

module.exports = function (controllerChannel) {
  var model = createDefaultModel();

  var setModel = function (newModel) {
    model = newModel;
    controllerChannel.panning(model.panning);
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
