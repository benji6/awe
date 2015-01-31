var Minivents = require('minivents');

var keyCodesToNotes = [];
keyCodesToNotes[90] = 'C4';
keyCodesToNotes[88] = 'D4';
keyCodesToNotes[67] = 'E4';
keyCodesToNotes[86] = 'F4';
keyCodesToNotes[66] = 'G4';
keyCodesToNotes[78] = 'A4';
keyCodesToNotes[77] = 'B4';

var notesToFrequencies = {
  "C4": 261.63,
  "D4": 293.66,
  "E4": 329.63,
  "F4": 349.23,
  "G4": 392.00,
  "A4": 440.00,
  "B4": 493.88
};

var minivents = new Minivents();

document.body.onkeydown = (e) => {
  var freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  console.log(e.keyCode);
  console.log(keyCodesToNotes[e.keyCode]);
  console.log(freq);
  if (freq) {
    minivents.emit('keyDown', freq);
  }
};
document.body.onkeyup = (e) => {
  var freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  console.log(e.keyCode);
  console.log(keyCodesToNotes[e.keyCode]);
  console.log(freq);
  minivents.emit('keyUp', freq);
};

module.exports = minivents;
