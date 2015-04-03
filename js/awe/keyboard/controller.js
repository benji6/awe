var keyCodesToNotes = require('./model/keyCodesToNotes.js');
var notesToFrequencies = require('./model/notesToFrequencies.js');
var startChannels = require('./model/startChannels.js');
var stopChannels = require('./model/stopChannels.js');

document.body.onkeydown = function (e) {
  const freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  if (!freq) {
    return;
  }
  for (var i = 0; i < startChannels.length; i++) {
    startChannels[i](freq);
  }
  if (e.keyCode === 191) {
    e.preventDefault();
  }
};

document.body.onkeyup = function (e) {
  var freq = notesToFrequencies[keyCodesToNotes[e.keyCode]];
  if (!freq) {
    return;
  }
  for (var i = 0; i < stopChannels.length; i++) {
    stopChannels[i](freq);
  }
};

module.exports = {
  addStartChannel: function (channel) {
    startChannels.push(channel);
  },
  addStopChannel: function (channel) {
    stopChannels.push(channel);
  }
};
