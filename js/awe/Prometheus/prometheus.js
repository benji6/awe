const R = require('ramda');
const Y = require('../Utils/Y.js');
const Menu = require('./Menu/Controller.js');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

const pluginName = "Prometheus";

const destroyAllChildren = function (parentDomElement) {
  while (parentDomElement.firstChild) {
    parentDomElement.removeChild(parentDomElement.firstChild);
  }
};

module.exports = function (parentDestination, viewContainers, startChannel, stopChannel) {
  const oldState = {};

  const purgeOldState = function () {
    destroyAllChildren(viewContainers.synth);
    destroyAllChildren(viewContainers.menu);
  };

  return Y(function (recurse) {
    return function (model) {
      purgeOldState();

      const noteStartListeners = [];
      const noteStopListeners = [];

      const nodeModelsWithIds = R.zipWith(function (id, nodeModel) {
        nodeModel.id = id;
        return nodeModel;
      }, R.pluck("id", model), R.pluck("model", model));

      const nodes = R.zipWith(function (type, nodeModel) {
        return typeToNodeFactoryMap[type](nodeModel);
      }, R.pluck("type", model), nodeModelsWithIds);

      R.zipWith(function (node, connections) {
        R.both(R.identity, R.forEach(function (connection) {
          R.either(R.eq(undefined), function (connectionId) {
            node.connect(R.find(R.propEq("id", connectionId), nodes).destinations[connection.destination]);
          })(connection.id);
        }))(connections);
      }, nodes, R.pluck("connections", model));

      R.zipWith(function (node, inputs) {
        R.both(R.identity, R.forEach(function (input) {
          R.either(R.eq(undefined), function (inputId) {
            node.inputs[input.destination](R.find(R.propEq("id", inputId), nodes));
          })(input.id);
        }))(inputs);
      }, nodes, R.pluck("inputs", model));

      R.zipWith(function (node, modelEventListener) {
          R.either(R.eq(undefined), R.forEach(R.cond(
            [R.eq("noteStart"), function () {
              noteStartListeners.push(node);
            }],
            [R.eq("noteStop"), function () {
              noteStopListeners.push(node);
            }]
          )))(modelEventListener);
      }, nodes, R.pluck("eventListeners", model));

      oldState.rootAudioNode && oldState.rootAudioNode.disconnect();
      oldState.rootAudioNode = nodes[0].destinations.destination;
      nodes[0].connect(parentDestination);

      const onStart = function (freq) {
        for (var i = 0; i < noteStartListeners.length; i++) {
          noteStartListeners[i].noteStart(freq);
        }
      };

      const onStop = function (freq) {
        for (var i = 0; i < noteStopListeners.length; i++) {
          noteStopListeners[i].noteStop(freq);
        }
      };

      startChannel.remove(oldState.onStart);
      stopChannel.remove(oldState.onStop);

      oldState.onStart = onStart;
      oldState.onStop = onStop;

      startChannel.add(onStart);
      stopChannel.add(onStop);

      Menu(recurse, model, pluginName).view.connect(viewContainers.menu);

      R.forEach(function (node) {
        node.view.connect(viewContainers.synth);
      }, nodes);
    };
  });
};
