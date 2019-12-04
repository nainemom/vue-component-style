export function dashCase(c) {
  let ret = '';
  for (let i = 0; i < c.length; i += 1) {
    if (i > 0 && /[A-Z]/.test(c[i])) {
      ret += '-';
    }
    ret += c[i].toLowerCase();
  }
  return ret;
}

export function objToArr(obj, cb) {
  Object.keys(obj).forEach((key) => {
    cb(key, obj[key]);
  });
}

export function isObject(x) {
  return typeof x === 'object' && x !== null && x.toString() === '[object Object]';
}

export function isFunction(x) {
  return typeof x === 'function';
}

export function isUndefined(x) {
  return typeof x === 'undefined';
}

export function makeError(msg) {
  throw new Error(`[VueComponentStyle] ${msg}`);
}

// https://stackoverflow.com/a/34842797
export function hashCode(str) {
  // eslint-disable-next-line no-bitwise
  return str.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
}
