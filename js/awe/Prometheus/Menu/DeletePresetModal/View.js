const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

module.exports = function (model, channels) {
  const defaultMessage = "Permanently delete preset";

  const enterConfirmationState = function () {
    select.disabled = true;
    message.value = `Are you sure you want to permanently delete preset "${select.value}"?`;
    deleteButton.className = "hidden";
    confirmButton.className = "";
  };

  const enterDeleteState = function () {
    select.disabled = false;
    message.value = defaultMessage;
    deleteButton.className = "";
    confirmButton.className = "hidden";
  };

  const container = createElement(h("div.hidden"));
  const select = createElement(h("select"));
  const message = createElement(h("output", defaultMessage));

  const deleteButton = createElement(h("button", "Delete", {
    onclick: function () {
      if (select.value === '') {
        return;
      }
      enterConfirmationState();
    }
  }));

  const confirmButton = createElement(h("button", "Confirm Delete", {
    onclick: function () {
      channels.deletePreset(select.value);
      container.className = "hidden";
      enterDeleteState();
    }
  }));

  container.appendChild(createElement(h("h3", "Delete Preset")));
  container.appendChild(select);
  container.appendChild(createElement(h("div.margin"))).appendChild(message);
  container.appendChild(deleteButton);
  container.appendChild(confirmButton);
  container.appendChild(createElement(h("button", "Cancel", {
    onclick: function () {
      container.className = "hidden";
      enterDeleteState();
    }
  })));

  const populatePresets = function (presets) {
    if (presets && presets.length) {
      jsml = presets.map(function (preset) {
        return {
          tag: "option",
          value: preset,
          text: preset
        };
      });
    } else {
      jsml = {
        disabled: "disabled",
        selected: "selected",
        tag: "option",
        text: "No Saved Presets",
        value: ""
      };
    }

    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    jsmlParse(jsml, select);
  };

  var open = function () {
    container.className = "modalWindow";
  };

  return {
    container: container,
    open: open,
    populatePresets: populatePresets
  };
};
