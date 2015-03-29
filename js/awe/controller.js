var audioContext = require('./audioContext.js');
var view = require('./view.js');
var keyboard = require('./keyboard/controller.js');
var sequencer = require('./sequencer/controller.js');
var Prometheus = require('./Prometheus/Controller.js');

var prometheus = Prometheus();

prometheus.connectView(view.destinationView);
prometheus.connect(audioContext.destination);
keyboard.addStartChannel(prometheus.channelStart);
keyboard.addStopChannel(prometheus.channelStop);
