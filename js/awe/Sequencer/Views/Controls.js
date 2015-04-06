const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = (model, controller, parentDomElement) => {
  const createVirtualRoot = () => h("div.center", h("table", h("tr", [
    h("td", "BPM"),
    h("input", {
      type: "range",
      min: 40,
      max: 240,
      oninput: function () {
        controller.oninput(this.value);
      },
      value: model.getBpm()
    }),
    h("output", String(model.getBpm()))
  ])));

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
