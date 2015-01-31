module.exports = (audioCtx) => {
  var gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.01;

  return gainNode;
};
