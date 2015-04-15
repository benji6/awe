const R = require('ramda');
const samples = require('./data/samples.js');

const getClassNameFromCode = (code) => [
  "empty",
  "selected",
  "emptyActive",
  "selectedActive"
][code];

module.exports = (score) => {
  var i = 0;
  const scoreLength = R.length(score);
  const samplesCount = R.length(samples);

  const moveToNextScoreStep = () => i++ < scoreLength ? i : i = 0;

  const getCurrentScoreValue = () => R.map(R.nth(i), score);

  const getViewData = () => R.map((row) => R.mapIndexed((cell, columnIndex) => getClassNameFromCode(R.eq(i, columnIndex) ? cell + 2 : cell), row), score);

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
    resetPosition,
    updatePattern
  };
};
