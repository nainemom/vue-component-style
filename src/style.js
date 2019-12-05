import { dashCase, objToArr } from './utils';

const STYLESHEET_ID_KEY = 'data-vcs-id';
const STYLESHEET_TYPE = 'text/css';

function objectToCss(selector, style) {
  let ret = '';
  const nexts = [];
  ret += `${selector}{`;
  objToArr(style, (key, value) => {
    const prop = dashCase(key);
    if (prop[0] === '&') {
      // nested
      const arrProp = Array.isArray(prop) ? prop : [prop];
      const newSelector = arrProp.map((x) => x.split('&').join(selector)).join(',');
      nexts.push(
        objectToCss(newSelector, value),
      );
    } else {
      ret += `${prop}:${value};`;
    }
  });
  ret += `}${nexts.join('')}`;
  return ret;
}

const calcClassName = (id, objectName) => dashCase(`vcs-${id}-${objectName}`);

export function injectStylesheet(
  id,
  innerHTML,
  documentObject = undefined,
  ssrAppObject = undefined,
) {
  if (typeof documentObject !== 'undefined') {
    const el = documentObject.querySelector(`style[${STYLESHEET_ID_KEY}="${id}"]`) || documentObject.createElement('style');
    el.setAttribute(STYLESHEET_ID_KEY, id);
    el.type = STYLESHEET_TYPE;
    el.innerHTML = innerHTML;
    documentObject.head.appendChild(el);
  } else if (typeof ssrAppObject !== 'undefined') {
    const oldEl = ssrAppObject.head.style.find((x) => x[STYLESHEET_ID_KEY] === id);
    if (oldEl) {
      oldEl.innerHTML = innerHTML;
    } else {
      ssrAppObject.head.style.push({
        [STYLESHEET_ID_KEY]: id,
        type: STYLESHEET_TYPE,
        innerHTML,
      });
    }
  }
  return id;
}

export function deleteStylesheet(id, documentObject, ssrAppObject) {
  if (typeof documentObject !== 'undefined') {
    const el = documentObject.querySelector(`style[${STYLESHEET_ID_KEY}="${id}"]`);
    if (el) {
      el.remove();
    }
  } else if (typeof ssrAppObject !== 'undefined') {
    const index = ssrAppObject.head.style.findIndex((x) => x[STYLESHEET_ID_KEY] === id);
    if (index !== -1) {
      ssrAppObject.splice(index, 1);
    }
  }
}

export function componentCss(id, classesObject) {
  let content = '';
  const maps = {};
  objToArr(classesObject, (objectName, objectContent) => {
    const className = calcClassName(id, objectName);
    maps[objectName] = className;
    content += objectToCss(`.${className}`, objectContent);
  });
  return {
    content,
    maps,
  };
}
