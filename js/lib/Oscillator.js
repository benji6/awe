module.exports = (audioCtx) => {
  var oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 1000;

  return oscillator;
};
