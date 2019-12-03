import { dashCase, objToArr } from './utils';
import cache from './cashe';

function objectToCss(selector, style) {
  let ret = '';
  const nexts = [];
  ret += `${selector} {`;
  objToArr(style, (key, value) => {
    const prop = dashCase(key);
    if (prop.includes('&')) {
      // nested
      const arrProp = Array.isArray(prop) ? prop : [prop];
      const newSelector = arrProp.map((x) => x.split('&').join(selector)).join(',');
      nexts.push(
        objectToCss(newSelector, value),
      );
    } else {
      ret += `${prop}: ${value};`;
    }
  });
  ret += '} ';
  nexts.forEach((nextRet) => {
    ret += nextRet;
  });
  return ret;
}

function applyStyle(name, content, append, options) {
  const key = 'data-vcs-class';
  if (options.headObject) {
    let index = options.headObject.style.findIndex((x) => x[key] === name && x[key].innerHTML !== '');
    if (index === -1) {
      console.log('one new thing');
      index = options.headObject.style.push({
        [key]: name,
        rel: 'stylesheet',
        innerHTML: content,
      }) - 1;
    } else {
      console.log('one old thing with append', append);
      const item = options.headObject.style[index];
      item.innerHTML = (append ? item.innerHTML : '') + content;
    }
    console.log('inserted to headObject', options.headObject.style);
  }
  if (options.documentObject) {
    const doc = document;
    let el = doc.querySelector(`style[${key}="${name}"]`);
    if (!el) {
      el = doc.createElement('style');
      el.setAttribute(key, name);
      el.setAttribute('type', 'text/css');
      doc.head.appendChild(el);
    }
    // el.innerHTML = (append ? el.innerHTML : '') + content;
  }
}

export default function (classes, options) {
  const ret = {};
  objToArr(classes, (name, content) => {
    const hash = JSON.stringify(content);
    const isDynamic = name.indexOf('$') === 0;
    if (isDynamic) {
      const cached = cache.get(hash, 'hash');
      if (cached) {
        ret[name] = [cached.name];
      } else {
        const generatedName = cache.name(name.substr(1));
        const cssContent = objectToCss(`.${generatedName}`, content);
        cache.add(generatedName, hash);
        applyStyle(name, cssContent, true, options);
        ret[name] = [generatedName];
      }
    } else {
      const cssContent = objectToCss(`.${name}`, content);
      cache.add(name, hash);
      applyStyle(name, cssContent, false, options);
      ret[name] = [name];
    }
  });

  return ret;
}
