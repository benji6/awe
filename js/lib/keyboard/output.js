var Minivents = require('minivents');
var keyCodesToNotes = require('./keyCodesToNotes.js');
var notesToFrequencies = require('./notesToFrequencies.js');

var minivents = new Minivents();

var getFreq = (e) => notesToFrequencies[keyCodesToNotes[e.keyCode]];

document.body.onkeydown = (e) => {
  var freq = getFreq(e);
  if (freq) {
    minivents.emit('keyDown', freq);
  }
};
document.body.onkeyup = (e) => {
  var freq = getFreq(e);
  minivents.emit('keyUp', freq);
};

module.exports = minivents;
