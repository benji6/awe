var audioCtx = new AudioContext();

var Oscillator = require ('./lib/Oscillator.js');
var GainNode = require ('./lib/GainNode.js');

var oscillator = Oscillator(audioCtx);
var gainNode = GainNode(audioCtx);

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

oscillator.start();
