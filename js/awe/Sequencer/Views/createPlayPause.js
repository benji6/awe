const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = (model, controller, parentDomElement) => {
  const createVirtualRoot = () => h("div.center", [
    h(`div.${model.getPlaying() ? "playSelected" : "play"}`, {onclick: () => controller.play()}),
    h(`div.${model.getPlaying() ? "stop" : "stopSelected"}`, {onclick: () => controller.stop()})
  ]);

  var virtualRoot = createVirtualRoot();

  const domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const render = (value) => {
    const newVirtualRoot = createVirtualRoot();
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    render
  };
};
