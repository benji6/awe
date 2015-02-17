var createDefaultModel = () => {
  return {
    panning: 0,
    volume: 0.1
  };
};

module.exports = (channels) => {
  var model = createDefaultModel();

  var init = () => {
    model = createDefaultModel();
    channels.masterVolume(model.volume);
    channels.masterPanning(model.panning);
  };

  return {
    getModel: () => model,
    init,
    setModel: (newModel) => {
      model = newModel;
      channels.masterVolume(model.volume);
      channels.masterPanning(model.panning);
    }
  };
};
