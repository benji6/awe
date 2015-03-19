var AudioGraphModel = require('./AudioGraphModel.js');
var TypeToNodeFactoryMap = require('./TypeToNodeFactoryMap.js');

module.exports = function () {
  var audioGraphModel = AudioGraphModel();

  var nodes = audioGraphModel.model.map(function (modelNode) {
    return TypeToNodeFactoryMap[modelNode.type](modelNode.params);
  });

  audioGraphModel.model.forEach(function (modelNode, index, array) {
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

  var noteStart = function (freq) {
    nodes[nodes.length - 1].noteStart(freq);
  };

  var noteStop = function (freq) {
    nodes[nodes.length - 1].noteStop(freq);
  };

  return {
    connect,
    connectView,
    noteStart,
    noteStop
  };
};
