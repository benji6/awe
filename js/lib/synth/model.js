module.exports = {
  defaultSettings: {
    volume: {
      master: 0.1,
      sine: 0.1,
      square: 0.1,
      sawtooth: 0.1,
      triangle: 0.1
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
  },
  currentSettings: {
    volume: {
      master: 0.1,
      sine: 0.1,
      square: 0.1,
      sawtooth: 0.1,
      triangle: 0.1
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
  },
  activeNotes: new Map()
};
