const R = require('ramda');
const keyCodesToNotes = require('./model/keyCodesToNotes.js');
const notesToFrequencies = require('./model/notesToFrequencies.js');
const startChannels = require('./model/startChannels.js');
const stopChannels = require('./model/stopChannels.js');
const keyListeners = require('./model/keyListeners.js');

document.body.onkeydown = (e) => {
  const freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  if (!freq) {
    if (e.keyCode === 27) {
      keyListeners.escape();
    }
    return;
  }
  for (var i = 0; i < startChannels.length; i++) {
    startChannels[i](freq);
  }
  if (e.keyCode === 191) {
    e.preventDefault();
  }
};

document.body.onkeyup = (e) => {
  const freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  if (!freq) {
    return;
  }
  for (var i = 0; i < stopChannels.length; i++) {
    stopChannels[i](freq);
  }
};

module.exports = {
  startChannel: {
    add: (channel) => startChannels.push(channel),
    remove: (channel) => R.either(R.eq(R.negate(1)), (index) =>
      startChannels.splice(index, 1))(R.indexOf(channel, startChannels))
  },
  stopChannel: {
    add: (channel) => stopChannels.push(channel),
    remove: (channel) => R.either(R.eq(R.negate(1)), (index) =>
      stopChannels.splice(index, 1))(R.indexOf(channel, stopChannels))
  },
  setEscapeListener: (callback) => keyListeners.escape = callback
};
