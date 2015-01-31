module.exports = function (audioContext, type) {
  var oscillator = audioContext.createOscillator();
  oscillator.type = type;

  return oscillator;
};
