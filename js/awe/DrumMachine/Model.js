const R = require('ramda');
const notesToFrequencies = require('../data/notesToFrequencies.js');
const rowsToSamples = require('./rowsToSamples.js');

const getClassNameFromCode = (code) => [
  "empty",
  "selected",
  "emptyActive",
  "selectedActive"
][code];

module.exports = (score) => {
  var i = 0;
  const scoreLength = R.length(score);
  const samplesCount = R.length(rowsToSamples);

  const moveToNextScoreStep = () => ++i < scoreLength ? i : i = 0;
  const moveToPrevScoreStep = () => --i < 0 ? i = scoreLength - 1 : i;
  const getCurrentScoreValue = () => R.both(R.identity, R.map((freq) => notesToFrequencies[freq]))(score[i]);

  const getViewData = () => R.map((row) => R.map(getClassNameFromCode, row), score);

  const updatePattern = (row, col) => {
    const cellCode = score[row][col];
    const cellCodeEquals = R.eq(cellCode);
    score[row][col] = R.or(cellCodeEquals(0), cellCodeEquals(2)) ?
      R.add(1, cellCode) :
      R.subtract(cellCode, 1);
  };

  const resetPosition = () => i = 0;

  return {
    getCurrentScoreValue,
    getViewData,
    moveToNextScoreStep,
    moveToPrevScoreStep,
    resetPosition,
    updatePattern
  };
};
