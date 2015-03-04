var keyCodesToNotes = require('./model/keyCodesToNotes.js');
var notesToFrequencies = require('./model/notesToFrequencies.js');
var startChannels = require('./model/startChannels.js');
var stopChannels = require('./model/stopChannels.js');

var getFreq = function (e) {
  return notesToFrequencies[keyCodesToNotes[e.keyCode]];
};

document.body.onkeydown = function (e) {
  var freq = getFreq(e);
  if (freq) {
    startChannels.forEach(function(channel) {
      channel(freq);
    });
  }
};

document.body.onkeyup = function (e) {
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
