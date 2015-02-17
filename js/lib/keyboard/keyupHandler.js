module.exports = (stopChannels) =>
  (e) => {
    var freq = getFreq(e);
    stopChannels.forEach(function(channel) {
      channel(freq);
    });
  };
