var audioContext = require('../audioContext');
var pubsub = require('./pubsub.js');
var oscillators = require('./oscillators/controller.js');
var master = require('./master/controller.js');
var adsr = require('./adsr/controller.js');
var presets = require('./presets/controller.js');
var view = require('./view.js');

oscillators.connectOutputTo(master.inputNode);

module.exports = {
  connectOutputTo: (outputAudioNode) => {
    master.connectOutputTo(outputAudioNode);
  },
  connectViewTo: (parentDomElement) => {
    var synthParentView = view.connectViewTo(parentDomElement);
    master.connectViewTo(synthParentView);
    adsr.connectViewTo(synthParentView);
    oscillators.connectViewTo(synthParentView);

    presets.connectViewTo(synthParentView);
  }
};
