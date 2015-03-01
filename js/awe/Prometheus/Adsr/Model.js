var createDefaultModel = () => {
  return {
    name: "adsr",
    a: 1,
    d: 1,
    s: 0.5,
    r: 2
  };
};


module.exports = () =>{
  var model;
  var init = () => model = createDefaultModel();

  init();

  return {
    getModel: () => model,
    init,
    setModel: (newModel) => model = newModel
  };
};
