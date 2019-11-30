import { dashCase, objToArr } from './utils';
import cache from './cashe';

function objectToCss (selector, style) {
  let ret = ''
  const nexts = []
  ret += `${selector} {`
  objToArr(style, (key, value) => {
    const prop = dashCase(key)
    if (prop.includes('&')) {
      // nested
      const arrProp = Array.isArray(prop) ? prop : [prop]
      const newSelector = arrProp.map(x => x.split('&').join(selector)).join(',')
      nexts.push(
        objectToCss(newSelector, value)
      )
    } else {
      ret += `${prop}: ${value};`
    }
  })
  ret += '} '
  nexts.forEach(nextRet => {
    ret += nextRet
  })
  return ret
}

export default function (classes, head = []) {
  let ret = {}
  objToArr(classes, (name, content) => {
    const hash = cache.hash(content);
    const cached = cache.get(hash, 'hash')
    if (cached) {
      ret[name] = [cached.name]
    } else {
      const generatedName = cache.name(name);
      const cssContent = objectToCss(`.${generatedName}`, content);
      cache.add(generatedName, hash);
      head.style.push({
        type: 'text/css',
        innerHTML: cssContent,
        'data-x': 'salam'
      })
      ret[name] = [generatedName]
      // now use cssContent
    }
  })

  return ret
}