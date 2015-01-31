var pubsub = require('./pubsub.js');

module.exports = (audioContext) => {
  var gainNode = audioContext.createGain();
  gainNode.gain.value = 0.1;
  gainNode.connect(audioContext.destination);

  pubsub.on('volume', (volume) => {
    gainNode.gain.value = volume;
  });

  return gainNode;
};
