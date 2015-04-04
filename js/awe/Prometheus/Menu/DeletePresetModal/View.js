const createElement = require('virtual-dom/create-element');
const diff = require('virtual-dom/diff');
const h = require('virtual-dom/h');
const patch = require('virtual-dom/patch');
const R = require('ramda');

module.exports = function (channels, parentDomElement, presets) {
  const getSelectValue = function () {
    return domRoot.querySelector("select").value;
  };

  const createVirtualRoot = function (message, yesButton, selectIsDisabled) {
    return h("div.modalWindow", [
      h("h3", "Delete Preset"),
      h("select", {disabled: (selectIsDisabled ? true : false)}, R.both(R.identity, R.map(function (preset) {
        return h("option", preset);
      }))(presets)),
      h("div.margin", [
        h("output", message)
      ]),
      yesButton,
      h("button", {onclick: function () {
        domRoot.parentNode.removeChild(domRoot);
      }}, "Cancel")
    ]);
  };

  const message = presets.length ? "Permanently delete preset" : "No saved presets, refresh to reload defaults";

  var virtualRoot = createVirtualRoot(message, h("button", {onclick: function () {
    renderDeleteState(`Are you sure you want to permanently delete preset "${getSelectValue()}"?`);
  }}, "Delete"));
  var domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  const renderDeleteState = function (message) {
    const newVirtualRoot = createVirtualRoot(message, h("button", {onclick: function () {
      domRoot.parentNode.removeChild(domRoot);
      channels.deletePreset(getSelectValue());
    }}, "Confirm Delete"), true);
    domRoot = patch(domRoot, diff(virtualRoot, newVirtualRoot));
    virtualRoot = newVirtualRoot;
  };
};
