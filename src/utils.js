export const dashCase = (str) => str.split('').map((char) => (/[A-Z]/.test(char) ? '-' : '') + char.toLowerCase()).join('');

export const objToArr = (obj, cb) => Object.keys(obj).forEach((key) => cb(key, obj[key]));

export const makeError = (msg) => { throw new Error(`[VueComponentStyle] ${msg}`); };

export const typeOf = (x) => toString.call(x).match(/\s([a-zA-Z]+)/)[1];

// https://stackoverflow.com/a/34842797
// eslint-disable-next-line no-bitwise
export const hashCode = (str) => str.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
