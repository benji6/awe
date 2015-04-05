const LZString = require('lz-string');
const R = require('ramda');
const defaultPresets = require('./defaultPresets.js');

const isNotUndefined = function (x) {
  return R.not(R.eq(undefined, x));
};

const compress = function (str) {
  return LZString.compressToEncodedURIComponent(str);
};

const decompress = function (str) {
  return LZString.decompressFromEncodedURIComponent(str);
};

const decompressAndParse = R.compose(JSON.parse, decompress);

const getItem = function (key) {
  return localStorage.getItem(key);
};

const setItem = function (key, data) {
  return localStorage.setItem(key, data);
};

module.exports = function (pluginName) {
  const stringifyCompressAndSet = R.compose(R.curry(setItem)(pluginName), compress, JSON.stringify);
  const getDecompressAndParse = function () {
    return R.compose(decompressAndParse, getItem)(pluginName);
  };

  const savePreset = function (key, data) {
    stringifyCompressAndSet(R.assoc(key, data, getDecompressAndParse()));
  };

  const getPresets = function () {
    return R.sort(function (a, b) {
      return R.toLower(a).localeCompare(R.toLower(b));
    }, R.keys(getDecompressAndParse()));
  };

  const openPreset = function (key) {
    return getDecompressAndParse()[key];
  };

  const hasPresetKey = function (key) {
    return R.both(isNotUndefined, R.identity)(getDecompressAndParse()[key]);
  };

  const deletePreset = function (key) {
    stringifyCompressAndSet(R.dissoc(key, getDecompressAndParse()));
  };

  //clear out any data stored by previous versions
  try {
    R.either(getDecompressAndParse, localStorage.clear)();
  }
  catch (e) {
    localStorage.clear();
  }

  R.either(R.identity, function () {
    stringifyCompressAndSet({});
  })(localStorage[pluginName]);

  R.forEach(function (defaultPreset) {
    R.either(hasPresetKey, R.curry(R.flip(savePreset))(defaultPreset.model))(defaultPreset.name);
  }, defaultPresets);

  return {
    compress: compress,
    decompressAndParse: decompressAndParse,
    deletePreset: deletePreset,
    getPresets: getPresets,
    hasPresetKey: hasPresetKey,
    openPreset: openPreset,
    savePreset: savePreset
  };
};
