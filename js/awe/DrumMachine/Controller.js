const audioContext = require('../audioContext.js');
const View = require('./View.js');
const Model = require('./Model.js');
const score = require('./data/score.js');
const R = require('ramda');

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

const trigger = (channel) => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

module.exports = (chronos, parentDomElement) => {
  loadSample();

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
    R.forEach(R.both(R.eq(1), trigger), model.getCurrentScoreValue());
    model.moveToNextScoreStep();
    view.render();
  });
};
