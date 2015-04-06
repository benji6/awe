const R = require('ramda');
const score = require('./score.js');
const Model = require('./Model.js');
const createSequencerContainer = require('./Views/createSequencerContainer.js');
const PatternView = require('./Views/Pattern.js');
const createBpmControl = require('./Views/createBpmControl.js');
const createPlayPause = require('./Views/createPlayPause.js');
const Y = require('../utils/Y.js');

module.exports = (parentDomElement) => {
  const controllerChannels = {};
  const model = Model(score);
  const sequencerContainer = createSequencerContainer(parentDomElement);
  const playPauseView = createPlayPause(model, controllerChannels, sequencerContainer);
  const bpmControl = createBpmControl(model, controllerChannels, sequencerContainer);

  const patternView = PatternView(model, controllerChannels, sequencerContainer);

  controllerChannels.oninput = (value) => {
    model.setBpm(value);
    bpmControl.render(value);
  };
  controllerChannels.patternClick = (rowIndex, columnIndex) => {
    model.updatePattern(rowIndex, columnIndex);
    patternView.render();
  };
  controllerChannels.play = () => {
    if (model.getPlaying()) {
      return;
    }
    model.moveToPrevScoreStep();
    model.setPlaying(true);
    playPauseView.render();
    play();
  };
  controllerChannels.stop = () => {
    model.setPlaying(false);
    window.setTimeout(() => {
      R.forEach(noteStop, model.getCurrentScoreValue());
      model.resetPosition();
      patternView.render();
    }, model.getTimeInterval() * 1.1);
    playPauseView.render();
  };

  patternView.render();

  const startChannels = [];
  const stopChannels = [];

  const noteStart = (freq) => R.forEach((startChannel) => startChannel(freq), startChannels);
  const noteStop = (freq) => R.forEach((stopChannel) => stopChannel(freq), stopChannels);

  const play = Y((recurse) => () => {
    model.getPlaying() && window.setTimeout(recurse, model.getTimeInterval());
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
