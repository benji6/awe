const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');

const pluginName = "DrumMachine";

module.exports = (controller, parentDomElement) => {
  const container = parentDomElement.appendChild(createElement(h(`div.${pluginName}`, h("h2", pluginName))));

  const createVirtualRoot = () => h("div.center", [
    h("p", {onclick: controller.play}, "Click here to play sample")
  ]);

  var virtualRoot = createVirtualRoot();

  const domRoot = container.appendChild(createElement(virtualRoot));

  const render = (value) => {
    const newVirtualRoot = createVirtualRoot();
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    render
  };
};
