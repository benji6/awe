const R = require('ramda');
const notesToFrequencies = require('../data/notesToFrequencies.js');
const rowsToNotes = require('./rowsToNotes.js');

module.exports = (score) => {
  var i = 0;
  const scoreLength = R.length(score);
  const notesCount = R.length(rowsToNotes);

  const moveToNextScoreStep = () => ++i < scoreLength ? i : i = 0;
  const getCurrentScoreValue = () => R.both(R.identity, R.map((freq) => notesToFrequencies[freq]))(score[i]);
  const getViewData = () => {
    const activeColumnIndices = R.map((notes) => R.map((note) => R.findIndex(R.eq(note), rowsToNotes), notes), score);
    const emptyRows = R.repeat(R.repeat(0, scoreLength), notesCount);
    return R.mapIndexed(
      (row, rowIndex) => R.mapIndexed(
        (note, noteIndex) => R.contains(rowIndex)(activeColumnIndices[noteIndex]) ? 1 : 0,
      row),
    emptyRows);
  };

  return {
    getCurrentScoreValue,
    moveToNextScoreStep,
    getViewData
  };
};