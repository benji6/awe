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

  const update = (row, col) => {
    const step = score[col];
    const note = rowsToNotes[row];
    const index = R.indexOf(note, step);
    if (index !== -1) {
      return step.splice(index, 1);
    }
    return step.push(note);
  };

  return {
    getCurrentScoreValue,
    moveToNextScoreStep,
    getViewData,
    update
  };
};
