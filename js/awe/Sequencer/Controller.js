const R = require('ramda');
const score = require('./score.js');
const notesToFrequencies = require('../data/notesToFrequencies.js');

const bpm = 180 * 3 / 2;
const timeout = 60000 / bpm;

module.exports = () => {
  const startChannels = [];
  const stopChannels = [];

  const noteStart = (freq) => {
    for (var i = 0; i < startChannels.length; i++) {
      startChannels[i](freq);
    }
  };

  const noteStop = (freq) => {
    for (var i = 0; i < startChannels.length; i++) {
      stopChannels[i](freq);
    }
  };

  var i = 0;
  const scoreLength = R.length(score);
  const moveToNextScoreStep = () => ++i < scoreLength ? i : i = 0;
  const getCurrentScoreValue = () => notesToFrequencies[score[i]];

  window.setInterval(() => {
    const prevFreq = getCurrentScoreValue();
    moveToNextScoreStep();
    const currentFreq = getCurrentScoreValue();
    if (prevFreq && prevFreq !== currentFreq) {
      noteStop(prevFreq);
    }
    if (currentFreq) {
      noteStart(currentFreq);
    }
  }, timeout);

  return {
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
  };
};
