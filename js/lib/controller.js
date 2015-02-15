var audioContext = require('./audioContext.js');

var keyboard = require('./keyboard/output.js');
var sequencer = require('./sequencer/controller.js');
var Synth = require('./Synth/Controller.js');


var synth0 = Synth();
synth0.connectViewTo(document.body);
synth0.connect(audioContext.destination);
window.synth0 = synth0;

var synth1 = Synth();
synth1.connectViewTo(document.body);
synth1.connect(audioContext.destination);
window.synth1 = synth1;

sequencer.play();
