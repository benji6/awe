module.exports = (type) => {
  var createDefaultModel = function () {
    return {
      name: type,
      detune: 0,
      panning: 0,
      tune: 0,
      volume: 0.2
    };
  };

  var model;
  var init = () => model = createDefaultModel();

  init();

  return {
    getModel: () => model,
    init,
    setModel: (newModel) => model = newModel
  };
};
