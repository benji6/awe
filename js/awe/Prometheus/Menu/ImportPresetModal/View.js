const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');

module.exports = (channels, parentDomElement) => {
  const getInputValue = () => domRoot.querySelector('input').value;

  const createVirtualRoot = (message) => h("div.modalWindow", [
    h("h3", "Import Settings"),
    h("input", {placeholder: "Paste preset data here"}),
    h("div.margin", [
      h("output", message)
    ]),
    h("button", {onclick: () => {
      const response = channels.importPreset(getInputValue());

      if (response) {
        domRoot.querySelector('output').value = response;
        return;
      }
    }}, "Import"),
    h("button", {onclick: (element) => domRoot.parentNode.removeChild(domRoot)}, "Cancel")
  ]);

  var virtualRoot = createVirtualRoot("Warning: any unsaved settings will be lost");
  var domRoot = parentDomElement.appendChild(createElement(virtualRoot));
};
