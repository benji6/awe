const audioContext = require('../audioContext.js');
const View = require('./View.js');

var buffer;

const loadSample = () => new Promise((resolve) => {
  const request = new XMLHttpRequest();
  request.open("GET", "Bell_1.mp3", true);
  request.responseType = 'arraybuffer';
  request.onload = () => audioContext.decodeAudioData(request.response, (loadedBuffer) => {
    buffer = loadedBuffer;
    resolve();
  });
  request.send();
});

const play = () => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};


module.exports = (parentDomElement) => {
  controllerChannels = {
    play
  };
  View(controllerChannels, parentDomElement);
  loadSample();
};
