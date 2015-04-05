const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');
const R = require('ramda');

module.exports = function (presets, channels, parentDomEl) {
  var selectedValue = presets[0];

  const closeModal = function () {
    modalView.parentNode.removeChild(modalView);
  };

  const modalView = parentDomEl.appendChild(createElement(h("div.modalWindow", [
    h("h3", "Open Preset"),
    h("select", {onchange: function () {
      selectedValue = this.value;
    }}, R.map(function (preset) {
      return h("option", preset);
    }, presets)),
    h("button", {onclick: function () {
      closeModal();
      channels.openPreset(selectedValue);
    }}, "Open"),
    h("button", {onclick: closeModal}, "Cancel")
  ])));


};
