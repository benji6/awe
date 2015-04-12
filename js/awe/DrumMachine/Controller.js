const audioContext = require('../audioContext.js');
const View = require('./View.js');
const Model = require('./Model.js');
const score = require('./data/score.js');
const Y = require('../utils/Y.js');

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

const trigger = () => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};



module.exports = (parentDomElement) => {
  loadSample();
  
  const model = Model(score);
  const controllerChannels = {
    trigger
  };

  const view = View(model, controllerChannels, parentDomElement);
// view.render();



  const play = Y((recurse) => () => {
    model.getIsPlaying() && window.setTimeout(recurse, model.getTimeInterval());
    const prevFreqs = model.getCurrentScoreValue();
    model.moveToNextScoreStep();
    const currentFreqs = model.getCurrentScoreValue();
    R.forEach((prevFreq) => !R.contains(prevFreq, currentFreqs) && noteStop(prevFreq), prevFreqs);
    R.forEach(R.both(R.identity, noteStart), currentFreqs);
    patternView.render();
  });
};
