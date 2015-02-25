var audioContext = require('./audioContext.js');
var view = require('./view.js');
var keyboard = require('./keyboard/controller.js');
var sequencer = require('./sequencer/controller.js');
var Prometheus = require('./Prometheus/Controller.js');

var prometheus = Prometheus();

prometheus.connectViewTo(view.destinationView);
prometheus.connect(audioContext.destination);
keyboard.addStartChannel(prometheus.channelStart);
keyboard.addStopChannel(prometheus.channelStop);

// var synth1 = Synth();
// synth1.connectViewTo(document.body);
// synth1.connect(audioContext.destination);
//sequencer.play();
