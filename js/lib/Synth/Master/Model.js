var createDefaultModel = () => {
  return {
    panning: 0,
    volume: 0.1
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
