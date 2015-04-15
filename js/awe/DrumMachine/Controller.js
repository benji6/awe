const audioContext = require('../audioContext.js');
const View = require('./View.js');
const Model = require('./Model.js');
const score = require('./data/score.js');
const R = require('ramda');
const samples = require('./data/samples.js');

const loadSample = (filePath) => new Promise((resolve) => {
  const request = new XMLHttpRequest();
  request.open("GET", filePath, true);
  request.responseType = 'arraybuffer';
  request.onload = () => audioContext.decodeAudioData(request.response, resolve);
  request.send();
});

var buffers;

Promise.all(R.map(loadSample, R.pluck("location", samples))).then((loadedBuffers) => {
  buffers = loadedBuffers;
});

const masterGain = audioContext.createGain();
masterGain.gain.value = 0.4;
masterGain.connect(audioContext.destination);

const trigger = (channel) => {
  const source = audioContext.createBufferSource();
  source.buffer = buffers[channel];
  source.connect(masterGain);
  source.start(0);
};

module.exports = (chronos, parentDomElement) => {
  const model = Model(score);

  const controllerChannels = {
    patternClick: (rowIndex, columnIndex) => {
      model.updatePattern(rowIndex, columnIndex);
      view.render();
    }
  };

  const view = View(model, controllerChannels, parentDomElement);
  view.render();

  chronos.addStopListener(() => {
    model.resetPosition();
    view.render();
  });

  chronos.addTicListener(() => {
    R.forEachIndexed((cell, index) => R.eq(1, cell) && trigger(index), model.getCurrentScoreValue());
    model.moveToNextScoreStep();
    view.render();
  });
};
