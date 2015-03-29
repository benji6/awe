module.exports = [
  {
    id: 0,
    type: "master",
    connections: [
      {destination: "destination"}
    ],
    model: {
      gain: 0.2
    }
  },
  // {
  //   id: 1,
  //   type: "stereoPanner",
  //   connections: [
  //     {id: 0, destination: "destination"}
  //   ]
  // },
  // {
  //   id: 2,
  //   type: "filter",
  //   connections: [
  //     {id: 1, destination: "destination"}
  //   ]
  // },
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
    id: 4,
    type: "oscillator",
    connections: [
      {id: 0, destination: "destination"}
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
      volume: 0.02
    }
  }
];
