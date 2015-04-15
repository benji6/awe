const R = require('ramda');
const score = require('./score.js');
const Model = require('./Model.js');
const createView = require('./createView.js');

module.exports = (chronos, parentDomElement) => {
  var isFirstNote = true;

  const controllerChannels = {
    patternClick: (rowIndex, columnIndex) => {
      model.updatePattern(rowIndex, columnIndex);
      view.render();
    }
  };

  const model = Model(score);
  const view = createView(model, controllerChannels, parentDomElement);

  chronos.addStopListener(() => {
    isFirstNote = true;
    R.forEach(noteStop, model.getAllPossibleFrequencies());
    model.resetPosition();
    view.render();
  });

  chronos.addTicListener(() => {
    R.not(isFirstNote) && model.moveToNextScoreStep();
    isFirstNote = false;
    const prevFreqs = model.getPreviousScoreValue();
    const currentFreqs = model.getCurrentScoreValue();
    R.forEach((prevFreq) => !R.contains(prevFreq, currentFreqs) && noteStop(prevFreq), prevFreqs);
    R.forEach(R.both(R.identity, noteStart), currentFreqs);
    view.render();
  });

  view.render();

  const startChannels = [];
  const stopChannels = [];

  const noteStart = (freq) => R.forEach((startChannel) => startChannel(freq), startChannels);
  const noteStop = (freq) => R.forEach((stopChannel) => stopChannel(freq), stopChannels);

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
