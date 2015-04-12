const R = require('ramda');
const score = require('./score.js');
const Menu = require('./Menu/Controller.js');
const Model = require('./Model.js');
const createSequencerContainer = require('./Views/createSequencerContainer.js');
const PatternView = require('./Views/Pattern.js');
const Y = require('../utils/Y.js');

module.exports = (parentDomElement) => {
  const controllerChannels = {};
  const model = Model(score);
  const sequencerContainer = createSequencerContainer(parentDomElement);
  Menu(sequencerContainer);
  const patternView = PatternView(model, controllerChannels, sequencerContainer);

  controllerChannels.oninput = (value) => {
    chronos.setBpm(value);
    bpmControl.render(value);
  };
  controllerChannels.patternClick = (rowIndex, columnIndex) => {
    model.updatePattern(rowIndex, columnIndex);
    patternView.render();
  };
  controllerChannels.play = () => {
    if (chronos.getIsPlaying()) {
      return;
    }
    model.moveToPrevScoreStep();
    chronos.setIsPlaying(true);
    playPauseView.render();
    play();
  };
  controllerChannels.stop = () => {
    chronos.setIsPlaying(false);
    window.setTimeout(() => {
      R.forEach(noteStop, model.getCurrentScoreValue());
      model.resetPosition();
      patternView.render();
    }, chronos.getTimeInterval() * 1.1);
    playPauseView.render();
  };

  patternView.render();

  const startChannels = [];
  const stopChannels = [];

  const noteStart = (freq) => R.forEach((startChannel) => startChannel(freq), startChannels);
  const noteStop = (freq) => R.forEach((stopChannel) => stopChannel(freq), stopChannels);

  const play = Y((recurse) => () => {
    chronos.getIsPlaying() && window.setTimeout(recurse, chronos.getTimeInterval());
    const prevFreqs = model.getCurrentScoreValue();
    model.moveToNextScoreStep();
    const currentFreqs = model.getCurrentScoreValue();
    R.forEach((prevFreq) => !R.contains(prevFreq, currentFreqs) && noteStop(prevFreq), prevFreqs);
    R.forEach(R.both(R.identity, noteStart), currentFreqs);
    patternView.render();
  });



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
