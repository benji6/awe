var Minivents = require('minivents');

var keyCodesToNotes = [];
keyCodesToNotes[90] = 'C4';
keyCodesToNotes[83] = 'C#4/Db4';
keyCodesToNotes[88] = 'D4';
keyCodesToNotes[68] = 'D#4/Eb4';
keyCodesToNotes[67] = 'E4';
keyCodesToNotes[86] = 'F4';
keyCodesToNotes[71] = 'F#4/Gb4';
keyCodesToNotes[66] = 'G4';
keyCodesToNotes[72] = 'G#4/Ab4';
keyCodesToNotes[78] = 'A4';
keyCodesToNotes[74] = 'A#4/Bb4';
keyCodesToNotes[77] = 'B4';
keyCodesToNotes[87] = 'C5';
keyCodesToNotes[51] = 'C#5/Db5';
keyCodesToNotes[69] = 'D5';
keyCodesToNotes[52] = 'D#5/Eb5';
keyCodesToNotes[82] = 'E5';
keyCodesToNotes[84] = 'F5';
keyCodesToNotes[54] = 'F#5/Gb5';
keyCodesToNotes[89] = 'G5';
keyCodesToNotes[55] = 'G#5/Ab5';
keyCodesToNotes[85] = 'A5';
keyCodesToNotes[56] = 'A#5/Bb5';
keyCodesToNotes[73] = 'B5';
keyCodesToNotes[79] = 'C6';

var notesToFrequencies = {
  "C4": 261.63,
  "C#4/Db4": 277.18,
  "D4": 293.66,
  "D#4/Eb4": 311.13,
  "E4": 329.63,
  "F4": 349.23,
  "F#4/Gb4": 369.99,
  "G4": 392.00,
  "G#4/Ab4": 415.30,
  "A4": 440.00,
  "A#4/Bb4": 466.16,
  "B4": 493.88,
  "C5": 523.25,
  "C#5/Db5": 554.37,
  "D5": 587.33,
  "D#5/Eb5": 622.25,
  "E5": 659.25,
  "F5": 698.46,
  "F#5/Gb5": 739.99,
  "G5": 783.99,
  "G#5/Ab5": 830.61,
  "A5": 880.00,
  "A#5/Bb5": 932.33,
  "B5": 987.77,
  "C6": 1046.50
};

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
