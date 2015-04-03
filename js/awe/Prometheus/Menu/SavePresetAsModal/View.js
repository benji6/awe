const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const R = require('ramda');

module.exports = function (model, channels, parentDomElement) {
  const modalView = parentDomElement.appendChild(createElement(h("div.modalWindow", [
    h("h3", "Save Preset As"),
    h("input", {placeholder: "Input Preset Name"}),
    h("div.margin", [
      h("output")
    ]),
    h("button", {onclick: function () {
      if (input.value === "") {
        message.value = "Please input a preset name";
        return;
      }

      var response = channels.savePresetAs(input.value);

      if (response) {
        displayOverwriteState(response);
        return;
      }
      container.className = "hidden";
      displaySaveState();
    }}, "Save"),
    h("button", {onclick: function () {
      modalView.parentNode.removeChild(modalView);
    }}, "Cancel")
  ])));

  var displayOverwriteState = function (response) {
    saveButton.className = "hidden";
    overwriteButton.className = "";
    input.disabled = true;
    message.value = response;
  };

  var displaySaveState = function () {
    saveButton.className = "";
    overwriteButton.className = "hidden";
    message.value = '';
    input.disabled = false;
  };

      // {
      //   tag: "button",
      //   text: "Overwrite",
      //   className: "hidden",
      //   callback: function (element) {
      //     overwriteButton = element;
      //     element.onclick = function () {
      //       channels.overwritePreset(input.value);
      //       displaySaveState();
      //       container.className = "hidden";
      //     };
      //   }
      // }
};
