const R = require('ramda');
const score = require('./score.js');

var freq = 100;
const bpm = 180;
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

  const scoreLength = R.length(score);
  var idx = 0;
  const getCurrentScoreValue = () => score[++idx < scoreLength ? idx : idx = 0];

  window.setInterval(() => {
    const scoreValue = getCurrentScoreValue();
    if (!scoreValue) {
      return noteStop(freq);
    }
    noteStart(freq);
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
