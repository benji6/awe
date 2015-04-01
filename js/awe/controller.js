const audioContext = require('./audioContext.js');
const view = require('./view.js');
const keyboard = require('./keyboard/controller.js');
const sequencer = require('./sequencer/controller.js');
const Prometheus = require('./Prometheus/Controller.js');

const prometheus = Prometheus();

prometheus.connectView(view.destinationView);
prometheus.connect(audioContext.destination);
keyboard.addStartChannel(prometheus.noteStart);
keyboard.addStopChannel(prometheus.noteStop);
