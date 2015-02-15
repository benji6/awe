var audioContext = require('./lib/audioContext.js');

var keyboard = require('./lib/keyboard/output.js');
var sequencer = require('./lib/sequencer/controller.js');
var Synth = require('./lib/synth/controller.js');

var synth0 = Synth();
var synth1 = Synth();

//sequencer.play();

synth0.connectViewTo(document.body);
synth0.connect(audioContext.destination);

synth1.connectViewTo(document.body);
synth1.connect(audioContext.destination);


window.synth0 = synth0;
window.synth1 = synth1;
