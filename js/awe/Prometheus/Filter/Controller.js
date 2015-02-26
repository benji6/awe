var audioContext = require('../../audioContext');

module.exports = () => {
  var filter = audioContext.createBiquadFilter();

  filter.type = "lowshelf";
  filter.frequency.value = 1000;
  filter.gain.value = 25;

  return {
    connect: (node) => filter.connect(node),
    destination: filter
  };
};
