var createDefaultModel = () => {
  return {
    name: "filter",
    frequency: 8000,
    gain: 0,
    q: 0,
    type: "lowpass"
  };
};

module.exports = (channels) => {
  var model = createDefaultModel();

  var setModel = (newModel) => {
    model = newModel;
    channels.frequency(model.frequency);
    channels.q(model.q);
    channels.type(model.type);
    channels.gain(model.gain);
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
