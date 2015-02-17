var keyCodesToNotes = require('./keyCodesToNotes.js');
var notesToFrequencies = require('./notesToFrequencies.js');

var startChannels = [];
var stopChannels = [];

var getFreq = (e) => notesToFrequencies[keyCodesToNotes[e.keyCode]];

document.body.onkeydown = (e) => {
  var freq = getFreq(e);
  if (freq) {
    startChannels.forEach(function(channel) {
      channel(freq);
    });
  }
};

document.body.onkeyup = (e) => {
  var freq = getFreq(e);
  stopChannels.forEach(function(channel) {
    channel(freq);
  });
};

module.exports = {
  addStartChannel: function (channel) {
    startChannels.push(channel);
  },
  addStopChannel: function (channel) {
    stopChannels.push(channel);
  }
};
