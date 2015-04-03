const audioContext = require('./audioContext.js');
const view = require('./view.js');
const keyboard = require('./keyboard/controller.js');
const Prometheus = require('./Prometheus/Controller.js');

Prometheus(view.destinationView, audioContext.destination, keyboard.addStartChannel, keyboard.addStopChannel);
