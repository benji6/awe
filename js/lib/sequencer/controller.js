var pubsub = require('../pubsub.js');

var frequency = 100;
var bpm = 180;

var timeout = 60000 / bpm / 2;

var noteStart = function noteStart () {
  pubsub.emit('noteStart', frequency);
  window.setTimeout(noteFinish, timeout);
};
var noteFinish = function noteFinish () {
  pubsub.emit('noteFinish', frequency);
  window.setTimeout(noteStart, timeout);
};

module.exports = {
  play: noteStart,
  stop
};
