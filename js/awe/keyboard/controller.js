var keyCodesToNotes = require('./model/keyCodesToNotes.js');
var notesToFrequencies = require('./model/notesToFrequencies.js');
var startChannels = require('./model/startChannels.js');
var stopChannels = require('./model/stopChannels.js');

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
