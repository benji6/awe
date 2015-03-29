var createDefaultModel = function () {
  return {
    name: "filter",
    frequency: 8000,
    gain: 0,
    q: 0,
    type: "lowpass"
  };
};

module.exports = function (channels) {
  var model = createDefaultModel();

  var setModel = function (newModel) {
    model = newModel;
    channels.frequency(model.frequency);
    channels.q(model.q);
    channels.type(model.type);
    channels.gain(model.gain);
  };

  var init = function () {
    setModel(createDefaultModel());
  };

  return {
    getModel: function () {
      return model;
    },
    init: init,
    setModel: setModel
  };
};
