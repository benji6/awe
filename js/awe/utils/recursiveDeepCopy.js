// not currently used

module.exports = function (obj) {
  if (typeof obj === 'object') {
    var newObj;
    if (Array.isArray(obj)) {
      newObj = [];
      obj.forEach(function (element) {
        newObj.push(recursiveDeepCopy(element));
      });
      return newObj;
    }

    newObj = {};
    Object.keys(obj).forEach(function (key) {
      newObj[key] = recursiveDeepCopy(obj[key]);
    });

    return newObj;
  }
  return obj;
};
