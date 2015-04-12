const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');
const createContainer = require('./Views/createContainer.js');
const createPatternView = require('./Views/createPatternView.js');

const pluginName = "DrumMachine";

module.exports = (model, controller, parentDomElement) => {
  const container = createContainer(parentDomElement);

  const createVirtualRoot = () => h("div.center", [
    h("p", {onclick: controller.play}, "Click here to play sample")
  ]);

  var virtualRoot = createVirtualRoot();

  const domRoot = container.appendChild(createElement(virtualRoot));
  const patternView = createPatternView(model, controller, container);

  const render = () => {
    const newVirtualRoot = createVirtualRoot();
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
    patternView.render();
  };

  return {
    render
  };
};
