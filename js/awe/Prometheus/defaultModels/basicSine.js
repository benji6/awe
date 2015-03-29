module.exports = [
  {
    id: 0,
    name: "gain",
    connections: [
      {destination: "destination"}
    ]
  },
  {
    id: 1,
    name: "stereoPanner",
    connections: [
      {id: 0, destination: "destination"}
    ]
  },
  {
    id: 2,
    name: "filter",
    connections: [
      {id: 1, destination: "destination"}
    ]
  },
  {
    id: 3,
    name: "oscillator",
    connections: [
      {id: 2, destination: "destination"}
    ],
    eventListeners: [
      "noteStart",
      "noteFinish"
    ],
    params: {
      type: "square"
    }
  }
];
