var pubsub = require('../pubsub.js');
var keyCodesToNotes = require('./keyCodesToNotes.js');
var notesToFrequencies = require('./notesToFrequencies.js');

var getFreq = (e) => notesToFrequencies[keyCodesToNotes[e.keyCode]];

document.body.onkeydown = (e) => {
  var freq = getFreq(e);
  if (freq) {
    pubsub.emit('noteStart', freq);
  }
};
document.body.onkeyup = (e) => {
  var freq = getFreq(e);
  pubsub.emit('noteFinish', freq);
};
