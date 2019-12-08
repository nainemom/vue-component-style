const typeOf = (x) => ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1];
const each = (obj, cb) => {
  if (typeOf(obj) === 'Object') {
    Object.keys(obj).forEach((key) => cb(key, obj[key]));
  } else {
    obj.forEach(cb);
  }
};
const dashCase = (str) => str.split('').map((char) => (/[A-Z]/.test(char) ? '-' : '') + char.toLowerCase()).join('');
const propertyValueText = (key, value) => `${dashCase(key)}: ${value};`;
const nameOf = (id, name) => dashCase(`vcs-${id}-${name}`);

/*
give: "&:active, & > .b"
returns: "selector:active, selector > .b"
*/
const nestedCssSelector = (selector, nestedText) => nestedText.split('&').join(selector);

/*
gives
name, { color: 'red', '& > x': { color:'blue }}
returns
name { color: 'red' } name > x { color: 'blue' }
*/
function objectToCss(selector, object) {
  let content = '';
  const nexts = [];
  content += `${selector} {`;
  each(object, (key, value) => {
    if (typeOf(value) === 'Object') { // nested
      const newSelector = nestedCssSelector(selector, key);
      nexts.push(objectToCss(newSelector, value));
    } else {
      content += propertyValueText(key, value);
    }
  });
  content += `} ${nexts.join('\n')}`;
  return content;
}

function style({
  className,
  mediaQuery,
  keyFrames,
  custom,
}) {
  return [
    className('obj1', {
      color: 'red',
      backgroundColor: 'blue',
      '& > a': {
        color: 'blue',
        '&:active': {
          color: 'cyan',
        },
      },
    }),
    className('obj2', {
      animation: `${keyFrames('a')} 2s`,
      '&:before': {
        display: 'block',
        content: '"s"',
        color: 'blue',
      },
    }),
    keyFrames('a', {
      from: {
        color: 'red',
      },
      to: {
        color: 'blue',
      },
    }),
    mediaQuery({ minWidth: '900px', maxWidth: '1200px' }, [
      className('obj1', {
        color: 'red',
      }),
      className('obj2', {
        color: 'red',
      }),
    ]),
    custom('@font-face', {
      fontFamily: 'x',
      src: 'url(x-y-z)',
    }),
  ];
}


function callStyle (id, style) {
  const ret = {
    maps: {},
    content: '',
  };

  const helpers = {
    className(name, content = null) {
      const generatedName = nameOf(id, name);
      const generatedContent = objectToCss(`.${generatedName}`, content);
      ret.maps[name] = generatedName;
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
      return `@media screen and (${mediaFeatures}) { ${content.join(' ')} }`;
    },
    keyFrames(name, content = null) {
      const generatedName = nameOf(id, name);
      if (!content) {
        return generatedName;
      }
      const ret = (() => {
        const ret = [];
        each(content, (key, value) => {
          ret.push(
            objectToCss(dashCase(key), value),
          );
        });
        return ret.join(' ');
      })();
      return `@keyframes ${generatedName} { ${ret} }`;
    },
    custom(title, content) {
      return objectToCss(dashCase(title), content);
    },
  };

  ret.content = style(helpers).join('\n');
  return ret;
}

console.log(
  callStyle(2, style).content,
);


