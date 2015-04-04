const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = function (channels, parentDomElement) {
  const closeModal = function () {
    domRoot.parentNode.removeChild(domRoot);
  };

  const getInputValue = function () {
    return domRoot.querySelector('input').value;
  };

  const createVirtualRoot = function (message) {
    return h("div.modalWindow", [
      h("h3", "Import Settings"),
      h("input", {placeholder: "Paste preset data here"}),
      h("div.margin", [
        h("output", message)
      ]),
      h("button", {onclick: function () {
        const response = channels.importPreset(getInputValue());

        if (response) {
          domRoot.querySelector('output').value = response;
          return;
        }
      }}, "Import"),
      h("button", {onclick: function (element) {
        closeModal();
      }}, "Cancel")
    ]);
  };

  var virtualRoot = createVirtualRoot("Warning: any unsaved settings will be lost");
  var domRoot = parentDomElement.appendChild(createElement(virtualRoot));
};
