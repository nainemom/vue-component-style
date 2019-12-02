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

function styleTag(className = '') {
  const key = 'data-vcs-class'
  const doc = document
  let el = doc.querySelector(`style[${key}="${className}"]`)
  if (!el) {
    el = doc.createElement('style')
    el.setAttribute(key, className)
    el.setAttribute('type', 'text/css')
    doc.head.appendChild(el)
  }
  return el
}

export default function (classes) {
  const ret = {}
  objToArr(classes, (name, content) => {
    const hash = cache.hash(content);
    const isDynamic = name.indexOf('$') === 0
    const style = styleTag(name)
    if (isDynamic) {
      const cached = cache.get(hash, 'hash')
      if (cached) {
        ret[name] = [cached.name]
      } else {
        const generatedName = cache.name(name.substr(1));
        const cssContent = objectToCss(`.${generatedName}`, content);
        cache.add(generatedName, hash);
        style.innerHTML += cssContent
        ret[name] = [generatedName]
      }
    } else {
      const cssContent = objectToCss(`.${name}`, content);
      cache.add(name, hash);
      style.innerHTML = cssContent
      ret[name] = [name]
    }
  })

  return ret
}