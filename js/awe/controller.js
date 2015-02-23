var audioContext = require('./audioContext.js');
var view = require('./view.js');
var keyboard = require('./keyboard/controller.js');
var sequencer = require('./sequencer/controller.js');
var Synth = require('./Synth/Controller.js');

var synth0 = Synth();

synth0.connectViewTo(view.destinationView);
synth0.connect(audioContext.destination);
keyboard.addStartChannel(synth0.channelStart);
keyboard.addStopChannel(synth0.channelStop);

// var synth1 = Synth();
// synth1.connectViewTo(document.body);
// synth1.connect(audioContext.destination);

//sequencer.play();
