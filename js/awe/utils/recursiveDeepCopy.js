// not currently used

module.exports = (obj) => {
  if (typeof obj === 'object') {
    var newObj;
    if (Array.isArray(obj)) {
      newObj = [];
      obj.forEach((element) => {
        newObj.push(recursiveDeepCopy(element));
      });
      return newObj;
    }

    newObj = {};
    Object.keys(obj).forEach((key) =>
    newObj[key] = recursiveDeepCopy(obj[key]));

    return newObj;
  }
  return obj;
};
