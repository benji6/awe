var Pubsub = require('../Pubsub');

var inputPubsub = require('../pubsub.js');
var audioContext = require('../audioContext');
var Oscillators = require('./oscillators/Controller.js');
var Master = require('./master/Controller.js');
var Adsr = require('./adsr/Controller.js');
var Presets = require('./presets/Controller.js');
var view = require('./View.js');

var connect = (master) =>
  (outputNode) =>
    master.connect(outputNode);


module.exports = () => {
  var pubsub = Pubsub();
  var master = Master(pubsub);
  var adsr = Adsr(pubsub);
  var oscillators = Oscillators(pubsub, adsr.model);
  var presets = Presets(pubsub, adsr, master, oscillators);

  inputPubsub.sub('noteStart', oscillators.noteStart);
  inputPubsub.sub('noteFinish', oscillators.noteFinish);

  oscillators.connect(master.inputNode);

  var connectViewTo = (master) =>
  (parentDomElement) => {
    var synthParentView = view.connectViewTo(parentDomElement);
    master.view.connectTo(synthParentView);
    adsr.view.connectTo(synthParentView);
    oscillators.view.connectTo(synthParentView);

    presets.view.connectTo(synthParentView);
  };

  return {
    pubsub,
    connect: connect(master),
    connectViewTo: connectViewTo(master)
  };
};
