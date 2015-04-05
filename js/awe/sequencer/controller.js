var pubsub;

var frequency = 100;
var bpm = 180;

var timeout = 60000 / bpm / 2;

var noteStart = () => {
  pubsub.pub('noteStart', frequency);
  window.setTimeout(noteFinish, timeout);
};

var noteFinish = () => {
  pubsub.pub('noteFinish', frequency);
  window.setTimeout(noteStart, timeout);
};

module.exports = {
  play: noteStart,
  stop: stop
};
