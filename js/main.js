var audioContext = require('./lib/audioContext.js');
var keyboard = require('./lib/keyboard/output.js');
var synth = require('./lib/synth/controller.js');

synth.connectViewTo(document.body);
synth.connectOutputTo(audioContext.destination);
