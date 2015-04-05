const LZString = require('lz-string');
const R = require('ramda');
const defaultPresets = require('./defaultPresets.js');

const isNotUndefined = (x) => R.not(R.eq(undefined, x));
const compress = (str) => LZString.compressToEncodedURIComponent(str);
const decompress = (str) => LZString.decompressFromEncodedURIComponent(str);
const decompressAndParse = R.compose(JSON.parse, decompress);
const getItem = (key) => localStorage.getItem(key);
const setItem = (key, data) => localStorage.setItem(key, data);

module.exports = (pluginName) => {
  const stringifyCompressAndSet = R.compose(R.curry(setItem)(pluginName), compress, JSON.stringify);
  const getDecompressAndParse = () => R.compose(decompressAndParse, getItem)(pluginName);
  const savePreset = (key, data) => stringifyCompressAndSet(R.assoc(key, data, getDecompressAndParse()));
  const getPresets = () => R.sort((a, b) => R.toLower(a).localeCompare(R.toLower(b)), R.keys(getDecompressAndParse()));
  const openPreset = (key) => getDecompressAndParse()[key];
  const hasPresetKey = (key) => R.both(isNotUndefined, R.identity)(getDecompressAndParse()[key]);
  const deletePreset = (key) => stringifyCompressAndSet(R.dissoc(key, getDecompressAndParse()));

  //clear out any data stored by previous versions
  try {
    R.either(getDecompressAndParse, localStorage.clear)();
  }
  catch (e) {
    localStorage.clear();
  }

  R.either(R.identity, () => stringifyCompressAndSet({}))(localStorage[pluginName]);

  R.forEach((defaultPreset) =>
    R.either(hasPresetKey, R.curry(R.flip(savePreset))(defaultPreset.model))(defaultPreset.name), defaultPresets);

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
