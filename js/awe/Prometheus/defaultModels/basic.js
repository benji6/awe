module.exports = [
  {
    id: 0,
    type: "gain",
    connections: [
      {destination: "destination"}
    ]
  },
  {
    id: 1,
    type: "stereoPanner",
    connections: [
      {id: 0, destination: "destination"}
    ]
  },
  {
    id: 2,
    type: "filter",
    connections: [
      {id: 1, destination: "destination"}
    ]
  },
  {
    id: 3,
    type: "oscillator",
    connections: [
      {id: 2, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    params: {
      type: "saw"
    }
  },
  {
    id: 4,
    type: "oscillator",
    connections: [
      {id: 2, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteStop"
    ],
    params: {
      type: "square"
    }
  }
];
