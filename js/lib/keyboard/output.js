var pubsub = require('../pubsub.js');
var keyCodesToNotes = require('./keyCodesToNotes.js');
var notesToFrequencies = require('./notesToFrequencies.js');

var getFreq = (e) => notesToFrequencies[keyCodesToNotes[e.keyCode]];

document.body.onkeydown = (e) => {
  var freq = getFreq(e);
  if (freq) {
    pubsub.pub('noteStart', freq);
  }
};
document.body.onkeyup = (e) => {
  var freq = getFreq(e);
  pubsub.pub('noteFinish', freq);
};
