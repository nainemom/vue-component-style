export const dashCase = (str) => str.split('').map((char) => (/[A-Z]/.test(char) ? '-' : '') + char.toLowerCase()).join('');

export const makeError = (msg) => { throw new Error(`[VueComponentStyle] ${msg}`); };

export const typeOf = (x) => toString.call(x).match(/\s([a-zA-Z]+)/)[1];

export const each = (obj, cb) => (typeOf(obj) === 'Object' ? Object.keys(obj).forEach((key) => cb(key, obj[key])) : obj.forEach(cb));
