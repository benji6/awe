const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

module.exports = function (model, channels, parentDomEl) {
  const modalView = createElement(h("div.modalWindow", [
    h("h3", "Current Settings"),
    h("p", "Copy and send to a friend!"),
    h("hr"),
    h("output.tinyText", model),
    h("hr"),
    h("button", {onclick: function () {
      modalView.parentNode.removeChild(modalView);
    }}, "OK")
  ]));

  parentDomEl.appendChild(modalView);
};
