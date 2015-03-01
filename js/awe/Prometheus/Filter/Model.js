var createDefaultModel = () => {
  return {
    name: "filter",
    frequency: 1000,
    Q: 25,
    type: "lowpass"
  };
};

module.exports = (channels) => {
  var model = createDefaultModel();

  var setModel = (newModel) => {
    model = newModel;
    channels.frequency(model.frequency);
    channels.Q(model.Q);
    channels.type(model.type);
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
