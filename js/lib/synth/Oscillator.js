module.exports = (audioCtx) => {
  var oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';

  return oscillator;
};
