const R = require('ramda');

var currentFreq = 100;
const bpm = 180;
const timeout = 60000 / bpm / 2;
const coputeFreq = (freq) => {
  if (freq < 1200) {
    return freq * 1.5;
  }
  return 100;
};

module.exports = () => {
  const startChannels = [];
  const stopChannels = [];

  const noteStart = () => {
    for (var i = 0; i < startChannels.length; i++) {
      startChannels[i](currentFreq);
    }
  };

  const noteStop = () => {
    for (var i = 0; i < startChannels.length; i++) {
      stopChannels[i](currentFreq);
      currentFreq = coputeFreq(currentFreq);
    }
  };

  window.setInterval((noteStart), timeout);
  window.setTimeout(window.setInterval(noteStop, 500), timeout);

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
