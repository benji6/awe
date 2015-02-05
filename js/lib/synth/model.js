var generateDefaultSettings = () => {
  return {
    adsr: {
      a: 1,
      d: 1,
      s: 0.5,
      r: 2
    },
    volume: {
      master: 0.1,
      sine: 0.1,
      square: 0.1,
      sawtooth: 0.1,
      triangle: 0.1
    },
    tune: {
      sine: 0,
      square: 0,
      sawtooth: 0,
      triangle: 0
    },
    detune: {
      sine: 0,
      square: 0,
      sawtooth: 0,
      triangle: 0
    },
    panning: {
      master: 0,
      sine: 0,
      square: 0,
      sawtooth: 0,
      triangle: 0
    }
  };
};

module.exports = {
  defaultSettings: generateDefaultSettings(),
  currentSettings: generateDefaultSettings(),
  activeNotes: new Map()
};
