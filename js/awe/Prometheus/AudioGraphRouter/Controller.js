var AudioGraphModel = require('./AudioGraphModel.js');
var TypeToNodeFactoryMap = require('./TypeToNodeFactoryMap.js');

module.exports = function () {
  var audioGraphModel = AudioGraphModel();

  var nodes = audioGraphModel.model.map(function (node) {
    return TypeToNodeFactoryMap[node.type]();
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

  return {
    connect,
    connectView,
    destination: nodes[nodes.length - 1].destination
  };
};
