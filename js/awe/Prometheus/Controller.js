const AudioGraphRouter = require('./AudioGraphRouter/Controller.js');
const View = require('./View.js');

module.exports = function () {
  const view = View("Prometheus");

  const audioGraphRouter = AudioGraphRouter();

  const connectView = function (parentDomElement) {
    audioGraphRouter.connectView(view.connect(parentDomElement));
  };

  const connect = function (node) {
    audioGraphRouter.connect(node);
  };

  return {
    channelStart: function (freq) {
      audioGraphRouter.noteStart(freq);
    },
    channelStop: function (freq) {
      audioGraphRouter.noteStop(freq);
    },
    connect: connect,
    connectView: connectView
  };
};
