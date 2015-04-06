const R = require('ramda');
const notesToFrequencies = require('../data/notesToFrequencies.js');
const rowsToNotes = require('./rowsToNotes.js');

module.exports = (score) => {
  var i = 0;
  const scoreLength = R.length(score);
  const moveToNextScoreStep = () => ++i < scoreLength ? i : i = 0;
  const getCurrentScoreValue = () => R.both(R.identity, R.map((freq) => notesToFrequencies[freq]))(score[i]);
  const getViewData = () => R.map((notes) => R.map((note) => R.findIndex(R.eq(note), rowsToNotes), notes), score);

  return {
    getCurrentScoreValue,
    moveToNextScoreStep,
    getViewData
  };
};
