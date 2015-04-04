const audioContext = require('./audioContext.js');
const view = require('./view.js');
const keyboard = require('./keyboard/controller.js');
const Prometheus = require('./Prometheus/Controller.js');

Prometheus(audioContext.destination, view.destinationView, keyboard.startChannel, keyboard.stopChannel);
