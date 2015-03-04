var createDefaultModel = function () {
  return {
    panning: 0,
  };
};

module.exports = (controllerChannel) => {
  var model = createDefaultModel();

  var setModel = (newModel) => {
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
