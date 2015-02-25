var createDefaultModel = () => {
  return {
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
    a: model.a,
    d: model.d,
    s: model.s,
    r: model.r,
    init,
    setModel: (newModel) => model = newModel
  };
};
