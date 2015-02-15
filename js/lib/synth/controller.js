var Minivents = require('minivents');

var inputPubsub = require('../pubsub.js');
var audioContext = require('../audioContext');
var Oscillators = require('./oscillators/controller.js');
var Master = require('./master/controller.js');
var Adsr = require('./adsr/controller.js');
var Presets = require('./presets/controller.js');
var view = require('./view.js');

var connect = (master) =>
  (outputNode) =>
    master.connect(outputNode);


module.exports = () => {
  var pubsub = new Minivents();
  var master = Master(pubsub);
  var adsr = Adsr(pubsub);
  var oscillators = Oscillators(pubsub, adsr.model);
  var presets = Presets(pubsub);


  inputPubsub.on('noteStart', oscillators.noteStart);
  inputPubsub.on('noteStart', oscillators.noteStart);
  inputPubsub.on('noteFinish', oscillators.noteFinish);

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
