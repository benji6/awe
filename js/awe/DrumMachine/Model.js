const R = require('ramda');
const notesToFrequencies = require('../data/notesToFrequencies.js');
const rowsToSamples = require('./rowsToSamples.js');

const classNameFromCode = [
  "empty",
  "selected",
  "emptyActive",
  "selectedActive"
];

const getClassNameFromCode = (code) => classNameFromCode[code];

module.exports = (score) => {
  var i = 0;
  const scoreLength = R.length(score);
  const notesCount = R.length(rowsToSamples);

  const moveToNextScoreStep = () => ++i < scoreLength ? i : i = 0;
  const moveToPrevScoreStep = () => --i < 0 ? i = scoreLength - 1 : i;
  const getCurrentScoreValue = () => R.both(R.identity, R.map((freq) => notesToFrequencies[freq]))(score[i]);
  const getViewData = () => {
    const activeColumnIndices = R.map((notes) => R.map((note) => R.findIndex(R.eq(note), rowsToSamples), notes), score);
    const emptyRows = R.repeat(R.repeat(0, scoreLength), notesCount);
    const viewData = R.mapIndexed(
      (row, rowIndex) => R.mapIndexed(
        (note, noteIndex) => R.contains(rowIndex)(activeColumnIndices[noteIndex]) ? 1 : 0,
      row),
    emptyRows);
    const highlightedViewData = R.mapIndexed(
      (row, rowIndex) => R.mapIndexed(
        (note, noteIndex) => noteIndex === i ? note + 2 : note,
      row),
      viewData);
    return highlightedViewData;
  };

  const updatePattern = (row, col) => {
    const step = score[col];
    const note = rowsToSamples[row];
    const index = R.indexOf(note, step);
    if (index !== -1) {
      return step.splice(index, 1);
    }
    return step.push(note);
  };

  var bpm = 140;

  const getBpm = () => bpm;
  const setBpm = (value) => bpm = value;
  const getTimeInterval = () => 60000 / bpm / 2;

  var playing = false;

  const getIsPlaying = () => playing;
  const setIsPlaying = (boo) => playing = boo;

  const resetPosition = () => i = 0;

  return {
    getBpm,
    getClassNameFromCode,
    getCurrentScoreValue,
    getIsPlaying,
    getTimeInterval,
    getViewData,
    moveToNextScoreStep,
    moveToPrevScoreStep,
    resetPosition,
    setBpm,
    setIsPlaying,
    updatePattern
  };
};
