module.exports = function (audioContext, volume) {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = volume;

  return gainNode;
};
