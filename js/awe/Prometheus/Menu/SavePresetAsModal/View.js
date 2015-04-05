const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = (channels, parentDomElement) => {
  const closeModal = () => domRoot.parentNode.removeChild(domRoot);
  const createVirtualRoot = (message, inputIsDisabled, button) => {
    inputIsDisabled = inputIsDisabled === undefined ? false : inputIsDisabled;
    return h("div.modalWindow", [
      h("h3", "Save Preset As"),
      h("input", {disabled: inputIsDisabled, placeholder: "Input Preset Name"}),
      h("div.margin", [
        h("output", message)
      ]),
      R.either(R.identity, () => h("button", {onclick: () => {
          const response = channels.savePresetAs(getInputValue());
          if (typeof response === "string") {
            displayOverwriteState(response);
            return;
          }
        }}, "Save"))(button),
      h("button", {onclick: closeModal}, "Cancel")
    ]);
  };

  var virtualRoot = createVirtualRoot();
  var domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const getInputValue = () => domRoot.querySelector('input').value;

  const displayMessage = (message) => {
    const newVirtualRoot = createVirtualRoot(message);
    domRoot = patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  const displayOverwriteState = (message) => {
    const newVirtualRoot = createVirtualRoot(message, true, h("button", {onclick: () => {
      closeModal();
      channels.overwritePreset(getInputValue());
    }}, "Overwrite"));
    domRoot = patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };
};
