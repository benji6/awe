const view = require('./view.js');
const prometheus = require('./prometheus.js');
const model = require('./defaultModels/basic.js');

module.exports = function () {
  const synth = prometheus(model);

  return {
    channelStart: function (freq) {
      synth.noteStart(freq);
    },
    channelStop: function (freq) {
      synth.noteStop(freq);
    },
    connect: function (node) {
      synth.connect(node);
    },
    connectView: function (parentDomElement) {
      synth.view.connect(view("Prometheus").connect(parentDomElement));
    }
  };
};
