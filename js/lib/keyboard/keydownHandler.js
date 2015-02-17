module.exports = (startChannels) =>
  (e) => {
    var freq = getFreq(e);
    if (freq) {
      startChannels.forEach(function(channel) {
        channel(freq);
      });
    }
  };
