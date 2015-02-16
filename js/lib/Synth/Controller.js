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
  var master = Master();
  var adsr = Adsr();
  var oscillators = Oscillators(adsr.model);
  var presets = Presets(adsr, master, oscillators);

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
    channelStart: oscillators.noteStart,
    channelStop: oscillators.noteFinish,
    connect: connect(master),
    connectViewTo: connectViewTo(master)
  };
};
