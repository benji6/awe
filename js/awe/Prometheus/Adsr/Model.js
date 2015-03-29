var createDefaultModel = function () {
  return {
    name: "adsr",
    a: 1,
    d: 1,
    s: 0.5,
    r: 2
  };
};


module.exports = function () {
  var model;
  var init = function () {
    return model = createDefaultModel();
  };

  init();

  return {
    getModel: function () {
      return model;
    },
    init: init,
    setModel: function (newModel) {
      return model = newModel;
    }
  };
};
