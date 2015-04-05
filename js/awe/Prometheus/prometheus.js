const R = require('ramda');
const Y = require('../utils/Y.js');
const Menu = require('./Menu/Controller.js');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

const pluginName = "Prometheus";

const destroyAllChildren = (parentDomElement) => {
  while (parentDomElement.firstChild) {
    parentDomElement.removeChild(parentDomElement.firstChild);
  }
};

module.exports = (parentDestination, viewContainers, startChannel, stopChannel) => {
  const oldState = {};

  const purgeOldState = () => {
    destroyAllChildren(viewContainers.synth);
    destroyAllChildren(viewContainers.menu);
  };

  return Y((recurse) => (model) => {
    purgeOldState();

    const noteStartListeners = [];
    const noteStopListeners = [];

    const nodeModelsWithIds = R.zipWith((id, nodeModel) => {
      nodeModel.id = id;
      return nodeModel;
    }, R.pluck("id", model), R.pluck("model", model));

    const nodes = R.zipWith((type, nodeModel) =>
      typeToNodeFactoryMap[type](nodeModel), R.pluck("type", model), nodeModelsWithIds);

    R.zipWith((node, connections) =>
      R.both(R.identity, R.forEach((connection) =>
        R.either(R.eq(undefined), (connectionId) =>
          node.connect(R.find(R.propEq("id", connectionId), nodes)
            .destinations[connection.destination]))(connection.id)))(connections), nodes, R.pluck("connections", model));

    R.zipWith((node, inputs) =>
      R.both(R.identity, R.forEach((input) =>
        R.either(R.eq(undefined), (inputId) =>
          node.inputs[input.destination](R.find(R.propEq("id", inputId), nodes)))(input.id)))(inputs), nodes, R.pluck("inputs", model));

    R.zipWith((node, modelEventListener) =>
        R.either(R.eq(undefined), R.forEach(R.cond(
          [R.eq("noteStart"), () => noteStartListeners.push(node)],
          [R.eq("noteStop"), () => noteStopListeners.push(node)]
        )))(modelEventListener), nodes, R.pluck("eventListeners", model));

    oldState.rootAudioNode && oldState.rootAudioNode.disconnect();
    oldState.rootAudioNode = nodes[0].destinations.destination;
    nodes[0].connect(parentDestination);

    const onStart = (freq) => {
      for (var i = 0; i < noteStartListeners.length; i++) {
        noteStartListeners[i].noteStart(freq);
      }
    };

    const onStop = (freq) => {
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

    R.forEach((node) => node.view.connect(viewContainers.synth), nodes);
  });
};
