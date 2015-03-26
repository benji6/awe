module.exports = function (type) {
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
  var init = function () {
    return model = createDefaultModel();
  };

  init();

  return {
    getModel: function () {
      return model;
    },
    init,
    setModel: function (newModel) {
      return model = newModel;
    }
  };
};
