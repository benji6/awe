const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');

const pluginName = "Chronos";

module.exports = (model, parentDomElement, controllerChannels) => {
  const createVirtualRoot = () => h(`div.${pluginName}`, [
    h("h2", pluginName),
    h("div.center", [
      h(`div.${model.getIsPlaying() ? "playSelected" : "play"}`, {onclick: () => controller.play()}),
      h(`div.${model.getIsPlaying() ? "stop" : "stopSelected"}`, {onclick: () => controller.stop()})
    ]),
    h("div.center", h("table", h("tr", [
      h("td", "BPM"),
      h("td", h("input", {
        type: "range",
        min: 40,
        max: 300,
        oninput: function () {
          controller.oninput(this.value);
        },
        value: model.getBpm()
      })),
      h("td", h("output", String(model.getBpm())))
    ])))
  ]);

  var virtualRoot = createVirtualRoot();

  const domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const render = () => {
    const newVirtualRoot = createVirtualRoot();
    patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  return {
    render
  };
};
