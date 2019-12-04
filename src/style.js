import { dashCase, objToArr } from './utils';

function objectToCss(selector, style) {
  let ret = '';
  const nexts = [];
  ret += `${selector}{`;
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
      ret += `${prop}:${value};`;
    }
  });
  ret += '}';
  nexts.forEach((nextRet) => {
    ret += nextRet;
  });
  return ret;
}

function calcClassName(componentId, objectName) {
  return dashCase(`vcs-${componentId}-${objectName}`);
}

export function createStylesheet(componentId, content, isServer) {
  const item = {
    type: 'text/css',
    'data-vcsid': componentId,
    innerHTML: content,
  };
  if (isServer) {
    return item;
  }
  const el = document.querySelector(`style[data-vcsid="${item['data-vcsid']}"]`) || document.createElement('style');
  el.setAttribute('data-vcsid', componentId);
  el.type = item.type;
  el.innerHTML = item.innerHTML;
  return el;
}

export function componentCss(componentId, classesObject) {
  let content = '';
  const maps = {};
  objToArr(classesObject, (objectName, objectContent) => {
    const className = calcClassName(componentId, objectName);
    maps[objectName] = className;
    content += objectToCss(`.${className}`, objectContent);
  });
  return {
    content,
    maps,
  };
}
