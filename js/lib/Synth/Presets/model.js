var getPresets = () =>
  Object.keys(JSON.parse(localStorage.getItem("prometheus")));

var hasPresetKey = (key) =>
  JSON.parse(localStorage.getItem("prometheus"))[key] !== undefined;

var savePreset = function (key, data) {
  var storedData = {};

  if (localStorage.prometheus) {
    storedData = JSON.parse(localStorage.getItem("prometheus"));
  }

  storedData[key] = data;
  localStorage.setItem("prometheus", JSON.stringify(storedData));
};

module.exports = {
  getPresets,
  hasPresetKey,
  savePreset
};
