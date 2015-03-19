var AudioGraphModel = require('./AudioGraphModel.js');
var TypeToNodeFactoryMap = require('./TypeToNodeFactoryMap.js');

module.exports = function () {
  var audioGraphModel = AudioGraphModel();

  var eventListeners = {
    noteStart: [],
    noteStop: []
  };

  var nodes = audioGraphModel.model.map(function (modelNode) {
    return TypeToNodeFactoryMap[modelNode.type](modelNode.params);
  });

  audioGraphModel.model.forEach(function (modelNode, index, array) {
    if (modelNode.eventListeners) {
      modelNode.eventListeners.forEach(function (event) {
        switch (event) {
          case "noteStart":
            eventListeners.noteStart.push(nodes[index]);
          case "noteStop":
            eventListeners.noteStop.push(nodes[index]);
          }
      });
    }

    if (modelNode.connections) {
      modelNode.connections.forEach(function (connection) {
        nodes[index].connect(nodes[connection].destination);
      });
    }
  });

  var connect = function (destination) {
    nodes[0].connect(destination);
  };

  var connectView = function (parentView) {
    nodes.forEach(function (node) {
      node.view.connect(parentView);
    });
  };

  var noteStart = (function () {
    var listeners = eventListeners.noteStop;
    var i;

    return function (freq) {
      for (i = 0; i < listeners.length; i++) {
        listeners[i].noteStart(freq);
      }
    };
  }());

  var noteStop = (function () {
    var listeners = eventListeners.noteStop;
    var i;

    return function (freq) {
      for (i = 0; i < listeners.length; i++) {
        listeners[i].noteStop(freq);
      }
    };
  }());

  return {
    connect,
    connectView,
    noteStart,
    noteStop
  };
};
