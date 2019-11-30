export function dashCase (c) {
  let ret = ''
  for (let i = 0; i < c.length; i++) {
    if (i > 0 && /[A-Z]/.test(c[i])) {
      ret += '-'
    }
    ret += c[i].toLowerCase()
  }
  return ret
}

export function objToArr (obj, cb) {
  const ret = []
  Object.keys(obj).forEach(key => {
    ret.push(cb(key, obj[key]))
  })
  return ret
}

export function isObject(x) {
  return typeof x === 'object' && x !== null && x.toString() === '[object Object]'
}

export function isFunction(x) {
  return typeof x === 'function'
}

export function isUndefined(x) {
  return typeof x === 'undefined'
}