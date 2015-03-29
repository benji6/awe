module.exports = [
  {
    id: 0,
    type: "master",
    connections: [
      {destination: "destination"}
    ],
    model: {
      gain: 0.2,
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
      frequency: 8000,
      gain: 0,
      q: 0,
      type: "lowpass"
    }
  },
  // {
  //   id: 3,
  //   type: "oscillator",
  //   connections: [
  //     {destination: "destination"}
  //   ],
  //   eventListeners: [
  //     "noteStart",
  //     "noteStop"
  //   ],
  //   params: {
  //     type: "saw"
  //   }
  // },
  {
    type: "oscillator",
    connections: [
      {id: 1, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    model: {
      type: "saw",
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
    model: {
      type: "sine",
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
    model: {
      type: "triangle",
      detune: 0,
      panning: 0,
      tune: 0,
      volume: 0.2
    }
  }
];
