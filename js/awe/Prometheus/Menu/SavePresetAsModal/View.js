const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = function (model, channels, parentDomElement) {
  const closeModal = function () {
    domRoot.parentNode.removeChild(domRoot);
  };

  const createVirtualRoot = function (message, inputIsDisabled, button) {
    inputIsDisabled = inputIsDisabled === undefined ? false : inputIsDisabled;
    return h("div.modalWindow", [
      h("h3", "Save Preset As"),
      h("input", {disabled: inputIsDisabled, placeholder: "Input Preset Name"}),
      h("div.margin", [
        h("output", message)
      ]),
      R.either(R.identity, function () {
        return h("button", {onclick: function () {
          const inputValue = getInputValue();
          if (R.eq(inputValue, "")) {
            displayMessage("Please input a preset name");
            return;
          }

          const response = channels.savePresetAs(inputValue);
          if (response) {
            displayOverwriteState(response);
            return;
          }
          closeModal();
        }}, "Save");
      })(button),
      h("button", {onclick: closeModal}, "Cancel")
    ]);
  };

  var virtualRoot = createVirtualRoot();
  var domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const getInputValue = function () {
    return domRoot.querySelector('input').value;
  };

  const displayMessage = function (message) {
    const newVirtualRoot = createVirtualRoot(message);
    domRoot = patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };

  const displayOverwriteState = function (message) {
    const newVirtualRoot = createVirtualRoot(message, true, h("button", {onclick: function () {
      channels.overwritePreset(getInputValue());
      closeModal();
    }}, "Overwrite"));
    domRoot = patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };
};
