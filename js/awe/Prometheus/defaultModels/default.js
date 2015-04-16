module.exports = [
  {
    id: 0,
    type: "master",
    connections: [
      {destination: "destination"}
    ],
    model: {
      volume: 0.2,
      panning: 0
    }
  },
  {
    id: 1,
    type: "filter",
    connections: [
      {id: 0, destination: "destination"}
    ],
    model: {
      frequency: 3600,
      gain: 0,
      q: 0.2,
      type: "lowpass"
    }
  },
  {
    id: 2,
    type: "adsr",
    model: {
      a: 0,
      d: 1,
      s: 0.5,
      r: 0.5
    }
  },
  {
    id: 3,
    connections: [
      {id: 1, destination: "frequency"}
    ],
    type: "lfo",
    model: {
      amount: 1200,
      rate: 0.3,
      type: "triangle"
    }
  },
  {
    type: "oscillator",
    connections: [
      {id: 1, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    inputs: [
      {id: 2, destination: "gain"}
    ],
    model: {
      type: "sawtooth",
      detune: 0,
      panning: 0.2,
      tune: 0,
      volume: 0.2
    }
  },
  {
    type: "oscillator",
    connections: [
      {id: 1, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    inputs: [
      {id: 2, destination: "gain"}
    ],
    model: {
      type: "sine",
      detune: 0.08,
      panning: -0.2,
      tune: 0,
      volume: 0.2
    }
  },
  {
    type: "oscillator",
    connections: [
      {id: 1, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    inputs: [
      {id: 2, destination: "gain"}
    ],
    model: {
      type: "square",
      detune: 0,
      panning: 0,
      tune: 0,
      volume: 0.2
    }
  },
  {
    type: "oscillator",
    connections: [
      {id: 1, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    inputs: [
      {id: 2, destination: "gain"}
    ],
    model: {
      type: "triangle",
      detune: 0,
      panning: 0,
      tune: 0,
      volume: 0.2
    }
  }
];
