export const validate = (object, excludes = []) => {
  const keys = Object.keys(object);
  const result = keys.reduce((result, key) => {
    if (excludes.includes(key)) {
      return result;
    }
    return result && !object[key] == "";
  }, true);
  return result;
};
