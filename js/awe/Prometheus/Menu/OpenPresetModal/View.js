const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

module.exports = function (presets, channels, parentDomEl) {
  var selectedValue = presets[0];

  const modalView = parentDomEl.appendChild(createElement(h("div.modalWindow", [
    h("h3", "Open Preset"),
    h("select", {onchange: function () {
      selectedValue = this.value;
    }}, R.map(function (preset) {
      return h("option", preset);
    }, presets)),
    h("button", {onclick: function () {
      modalView.parentNode.removeChild(modalView);
      channels.openPreset(selectedValue);
    }}, "Open"),
    h("button", {onclick: function () {
      modalView.parentNode.removeChild(modalView);
    }}, "Cancel")
  ])));
};
