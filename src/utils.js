export const dashCase = (str) => str.split('').map((char) => {
  if (/[A-Z]/.test(char)) {
    return `-${char.toLowerCase()}`;
  }
  return char;
}).join('');


export const objToArr = (obj, cb) => Object.keys(obj).forEach((key) => {
  cb(key, obj[key]);
});

export const isObject = (x) => typeof x === 'object' && x !== null && x.toString() === '[object Object]';

export const isFunction = (x) => typeof x === 'function';

export const isUndefined = (x) => typeof x === 'undefined';

export const makeError = (msg) => { throw new Error(`[VueComponentStyle] ${msg}`); };

// https://stackoverflow.com/a/34842797
// eslint-disable-next-line no-bitwise
export const hashCode = (str) => str.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
