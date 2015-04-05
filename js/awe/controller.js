const audioContext = require('./audioContext.js');
const view = require('./view.js');
const keyboard = require('./keyboard/controller.js');
const Prometheus = require('./Prometheus/Controller.js');
const createSequencer = require('./Sequencer/Controller.js');

const sequencer = createSequencer();

Prometheus(audioContext.destination, view.destinationView, sequencer.startChannel, sequencer.stopChannel);
