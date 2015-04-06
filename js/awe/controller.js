const audioContext = require('./audioContext.js');
const view = require('./view.js');
const keyboard = require('./keyboard/controller.js');
const Prometheus = require('./Prometheus/Controller.js');
const createSequencer = require('./Sequencer/Controller.js');

const sequencer = createSequencer(view.destinationView);

const startChannels = [
  keyboard.startChannel,
  sequencer.startChannel
];

const stopChannels = [
  keyboard.stopChannel,
  sequencer.stopChannel
];

Prometheus(audioContext.destination, view.destinationView, startChannels, stopChannels);
