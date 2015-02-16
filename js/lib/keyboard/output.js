var keyCodesToNotes = require('./keyCodesToNotes.js');
var notesToFrequencies = require('./notesToFrequencies.js');

var getFreq = (e) => notesToFrequencies[keyCodesToNotes[e.keyCode]];
var startChannels = [];
var stopChannels = [];

var keyDownHandler = (e) => {
  var freq = getFreq(e);
  if (freq) {
    startChannels.forEach(function(channel) {
      channel(freq);
    });
  }
};

var keyUpHandler = (e) => {
  var freq = getFreq(e);
  stopChannels.forEach(function(channel) {
    channel(freq);
  });
};

document.body.onkeydown = keyDownHandler;
document.body.onkeyup = keyUpHandler;

module.exports = {
  addStartChannel: function (channel) {
    startChannels.push(channel);
  },
  addStopChannel: function (channel) {
    stopChannels.push(channel);
  }
};
