var AudioGraphRouter = require('./AudioGraphRouter/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var pluginName = "Prometheus";
var view = View(pluginName);

module.exports = function () {
  var menu = Menu(pluginName, []);

  var audioGraphRouter = AudioGraphRouter();

  var connectViewTo = function (master) {
    return function (parentDomElement) {
      var synthParentView = view.connectViewTo(parentDomElement);
      
      menu.view.connectTo(synthParentView);
      audioGraphRouter.connectView(synthParentView);
    };
  };

  var connect = function (node) {
    audioGraphRouter.connect(node);
  };

  return {
    channelStart: function (freq) {
      audioGraphRouter.noteStart(freq);
    },
    channelStop: function (freq) {
      audioGraphRouter.noteStop(freq);
    },
    connect,
    connectViewTo: connectViewTo(document.body)
  };
};
