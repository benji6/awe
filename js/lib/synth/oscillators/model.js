var defaultModel = {
  sawtooth: {
    detune: 0,
    panning: 0,
    tune: 0,
    volume: 0.1
  },
  sine: {
    detune: 0,
    panning: 0,
    tune: 0,
    volume: 0.1
  },
  square: {
    detune: 0,
    panning: 0,
    tune: 0,
    volume: 0.1
  },
  triangle: {
    detune: 0,
    panning: 0,
    tune: 0,
    volume: 0.1
  }
};

var model;
var init = () => model = defaultModel;

init();

module.exports = {
  getModel: () => model,
  init,
  setModel: (newModel) => model = newModel
};
