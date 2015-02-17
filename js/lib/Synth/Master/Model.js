var createDefaultModel = () => {
  return {
    panning: 0,
    volume: 0.1
  };
};

module.exports = (channels) => {
  var model = createDefaultModel();

  var setModel = (newModel) => {
    model = newModel;
    channels.masterVolume(model.volume);
    channels.masterPanning(model.panning);
  };

  var init = () => {
    setModel(createDefaultModel());
  };

  return {
    getModel: () => model,
    init,
    setModel
  };
};
