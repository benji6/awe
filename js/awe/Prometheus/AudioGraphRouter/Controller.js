var AudioGraphModel = require('./AudioGraphModel.js');
var TypeToNodeFactoryMap = require('./TypeToNodeFactoryMap.js');

module.exports = function () {
  var audioGraphModel = AudioGraphModel();

  var nodes = audioGraphModel.model.map(function (node) {
    return TypeToNodeFactoryMap[node.type]();
  });

  nodes.forEach(function (node, index, array) {
    if (node.connections) {
      node.connections.forEach(function (connection) {
        node.connect(array[index].destination);
      });
    }
  });

  console.log(nodes);
  window.n = nodes;

  var connect = function (destination) {
    nodes[0].connect(destination);
  };

  return {
    connect
  };
};
