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
      frequency: 300,
      gain: 0,
      q: 18,
      type: "highpass"
    }
  },
  {
    id: 2,
    type: "adsr",
    model: {
      a: 0.2,
      d: 1,
      s: 0.7,
      r: 2
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
      type: "saw",
      detune: -4,
      panning: -0.36,
      tune: 0,
      volume: 0.25
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
      type: "saw",
      detune: 4,
      panning: 0.36,
      tune: 7,
      volume: 0.2
    }
  },
];
