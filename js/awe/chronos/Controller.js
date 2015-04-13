const R = require('ramda');
const createModel = require('./createModel.js');
const data = require('./data.js');
const createView = require('./createView.js');
const Y = require('../utils/Y.js');

module.exports = (parentDomElement) => {
  const stopListeners = [];
  const ticListeners = [];

  const controllerChannels = {
    oninput: (value) => {
      model.setBpm(value);
      view.render();
    },

    play: () => {
      if (model.getIsPlaying()) {
        return;
      }
      model.setIsPlaying(true);
      view.render();
      tic();
    },

    stop: () => {
      model.setIsPlaying(false);
      view.render();
      R.forEach((listener) => listener(), stopListeners);
    }
  };

  const tic = Y((recurse) => () => {
    model.getIsPlaying() && window.setTimeout(recurse, model.getTimeInterval());
    R.forEach((listener) => listener(), ticListeners);
  });

  const model = createModel(data);
  const view = createView(model, parentDomElement, controllerChannels);

  return {
    addTicListener: (listener) => ticListeners.push(listener),
    addStopListener: (listener) => stopListeners.push(listener)
  };
};
