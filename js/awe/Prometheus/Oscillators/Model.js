var createDefaultModel = () => {
  return {
    detune: 0,
    panning: 0,
    tune: 0,
    volume: 0.2
  };
};

module.exports = () => {
  var model;
  var init = () => model = createDefaultModel();

  init();

  return {
    getModel: () => model,
    init,
    setModel: (newModel) => model = newModel
  };
};
