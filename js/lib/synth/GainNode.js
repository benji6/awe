var audioContext = require('../audioContext');

module.exports = function (volume) {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  return gainNode;
};
