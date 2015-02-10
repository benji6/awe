var defaultModel = {
  panning: 0,
  volume: 0.1
};

var model;
var init = () => model = defaultModel;

init();

module.exports = {
  getModel: () => model,
  init,
  setModel: (newModel) => model = newModel
};
