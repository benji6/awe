const R = require('ramda');
const score = require('./score.js');
const Model = require('./Model.js');
const View = require('./View.js');

const bpm = 180 * 3 / 2;
const timeout = 60000 / bpm;

module.exports = (parentDomElement) => {
  const model = Model(score);
  console.log(model.getViewData());
  View(parentDomElement, [
    ["A4"],
    ["A4", "B4"]
  ]);

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

  window.setInterval(() => {
    const prevFreqs = model.getCurrentScoreValue();
    model.moveToNextScoreStep();
    const currentFreqs = model.getCurrentScoreValue();
    R.forEach((prevFreq) =>
      R.both(R.not(R.contains(prevFreq, currentFreqs)), noteStop(prevFreq)), prevFreqs);
    R.forEach(R.both(R.identity, noteStart), currentFreqs);
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
