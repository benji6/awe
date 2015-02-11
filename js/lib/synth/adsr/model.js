var createDefaultModel = () => {
  return {
    a: 1,
    d: 1,
    s: 0.5,
    r: 2
  };
};

var model;
var init = () => model = createDefaultModel();

init();

module.exports = {
  getModel: () => model,
  init,
  setModel: (newModel) => model = newModel
};
