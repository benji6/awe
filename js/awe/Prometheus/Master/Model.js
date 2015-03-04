var createDefaultModel = function () {
  return {
    name: "master",
    panning: 0,
    volume: 0.2
  };
};

module.exports = (channels) => {
  var model = createDefaultModel();

  var setModel = (newModel) => {
    model = newModel;
    channels.volume(model.volume);
    channels.panning(model.panning);
  };

  var init = function () {
    setModel(createDefaultModel());
  };

  return {
    getModel: () => model,
    init,
    setModel
  };
};
