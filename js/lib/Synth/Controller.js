var Oscillators = require('./Oscillators/Controller.js');
var Master = require('./Master/Controller.js');
var Adsr = require('./Adsr/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var pluginName = "Prometheus";
var view = View(pluginName);

var connect = (master) =>
  (outputNode) =>
    master.connect(outputNode);

module.exports = () => {
  var master = Master();
  var adsr = Adsr();
  var oscillators = Oscillators(adsr.model);
  var menu = Menu(pluginName, adsr, master, oscillators);

  oscillators.connect(master.inputNode);

  var connectViewTo = (master) =>
  (parentDomElement) => {
    var synthParentView = view.connectViewTo(parentDomElement);

    menu.view.connectTo(synthParentView);
    master.view.connectTo(synthParentView);
    adsr.view.connectTo(synthParentView);
    oscillators.view.connectTo(synthParentView);
  };

  return {
    channelStart: oscillators.noteStart,
    channelStop: oscillators.noteFinish,
    connect: connect(master),
    connectViewTo: connectViewTo(master)
  };
};
