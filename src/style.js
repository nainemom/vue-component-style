import { dashCase, typeOf, each } from './utils';

const STYLESHEET_ID_KEY = 'data-vcs-id';
const STYLESHEET_TYPE = 'text/css';

const generateName = (id, name) => dashCase(`vcs-${id}-${name}`);

/*
gives
name, { color: 'red', '& > x': { color:'blue }}
returns
name { color: 'red' } name > x { color: 'blue' }
*/
const objectToCss = (selector, object) => {
  const ret = [`${selector} {`, '}'];
  let pointer = 1;
  each(object, (key, value) => {
    if (typeOf(value) === 'Object') { // nested
      ret.push(objectToCss(key.split('&').join(selector), value));
    } else {
      ret.splice(pointer, 0, `${dashCase(key)}:${value};`);
      pointer += 1;
    }
  });
  return ret.join('');
};


export const Helper = (id) => {
  const maps = {};
  return {
    maps,
    className(name, content = {}) {
      const generatedName = generateName(id, name);
      const generatedContent = objectToCss(`.${generatedName}`, content);
      maps[name] = generatedName;
      return generatedContent;
    },
    mediaQuery(mediaFeature, content = []) {
      const mediaFeatures = (() => {
        const ret = [];
        each(mediaFeature, (key, value) => {
          ret.push(`${dashCase(key)}: ${value}`);
        });
        return ret.join(' and ');
      })();
      return `@media screen and (${mediaFeatures}){${content.join(' ')}}`;
    },
    keyFrames(name, content) {
      const generatedName = generateName(id, name);
      maps[name] = generateName;
      if (!content) {
        return generatedName;
      }
      const ret = (() => {
        const reti = [];
        each(content, (key, value) => {
          reti.push(
            objectToCss(dashCase(key), value),
          );
        });
        return reti.join(' ');
      })();
      return `@keyframes ${generatedName} { ${ret} }`;
    },
    custom(rule, content) {
      return objectToCss(dashCase(rule), content);
    },
  };
};

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
