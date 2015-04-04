module.exports = [
  {
    id: 0,
    type: "master",
    connections: [
      {destination: "destination"}
    ],
    model: {
      volume: 0.25,
      panning: 0
    }
  },
  {
    id: 1,
    type: "adsr",
    model: {
      a: 0,
      d: 1,
      s: 0.75,
      r: 1.75
    }
  },
  {
    type: "oscillator",
    connections: [
      {id: 0, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    inputs: [
      {id: 1, destination: "gain"}
    ],
    model: {
      type: "sine",
      detune: 0,
      panning: 0,
      tune: 0,
      volume: 0.2
    }
  }
];
