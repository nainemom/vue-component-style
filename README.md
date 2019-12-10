# Vue Component Style

A `Vue` mixin to add `style` section in components with `Javascript` syntax.

## Features

- Zero Dependency
- Tiny (~1kb gzipped)
- Simple Setup and Usage
- Nested Support
- Pseudo Selector Support
- SSR Support
- Scoped to Component

## Install

```bash
npm i vue-component-style
# or with yarn
yarn add vue-component-style
```

## Setup

### Vue App

```javascript
import Vue from 'vue';
import VueComponentStyle from 'vue-component-style';

Vue.use(VueComponentStyle);
```

### Nuxt App

_nuxt.config.js_:
```javascript
module.exports = {
  modules: [
    'vue-component-style/nuxt'
  ],
}
```

Note that You don't need to do anything else with your webpack config or whatever.

## Usage

_component.vue_:
```html
<template>
  <div>
    <h1 :class="$style.title"> Title </h1>
    <div :class="$style.content">
      Content <a> Link </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: 'red'
    }
  },
  style({ className }) {
    return [
      className('title', {
        color: this.color,
        fontWeight: 'bold',
      }),
      className('content', {
        color: 'gray',
        marginBottom: `${this.size}px`,
        '& > a': {
          color: this.color,
          '&:visited': {
            textDecoration: 'underline',
          },
        },
      }),
    ];
  }
}
</script>
```

---

## API Documentions

### Define Style

    Function this.style(helper)

After activating **VueComponentStyle**, all components can have their js **style** section. Just like **data** section, you have to pass normal function that returning an Array. This function will invoke inside of **VueComponentStyle** with [`helper`](#helper) util object.

---

### Use Defined Styles

    Object this.$style

After you defining **style** prop in your component, all your classes defined by [`className()`](#class-name)s are accessable with **$style** computed object inside your component instance.

---

### Notice When Styles Updated

    VueEvent 'styleChange'

**styleChange** event fires when your style changes and applied to DOM.


---

### Helper

You can use **helper** object from first parameter of **style** function to defining your stylesheet. Helper object has these functions

- [`className()`](#class-name)
- [`mediaQuery()`](#media-query)
- [`keyFrames()`](#key-frames)
- [`custom()`](#custom)

#### Class Name

    Function helper.className(name, content)

To define your scopped css class styles, use this helper function.

| Param | Type | Default | Description |
| - | - | - | - |
| name | String | | Name of your class. All of your defined names will be accessable via $style Object later. |
| content | Object | {} | Your sass-style class properties. You can also style nested. |

##### Example

```javascript
style({ className }) {
  return [
    className('customClass', {
      color: 'red',
      fontWeight: 'bold',
      borderRadius: `${this.size}px`,
      '& > div': {
        color: 'blue',
      },
    }),
  ];
}
```

#### Media Query

    Function helper.mediaQuery(mediaFeature, content)

To define your customized style to different screen sizes, use this helper function. 

| Param | Type | Default | Description |
| - | - | - | - |
| mediaFeature | Object | | Media features. Common keys on this object are 'minWidth' and 'maxWidth'. |
| content | Array | [] | List of [`className()`](#class-name)s that you need to redefine. |

##### Example

```javascript
style({ mediaQuery, className }) {
  return [
    className('responsiveClass', {
      width: '50%',
    }),
    mediaQuery({ maxWidth: '320px' }, [
      className('responsiveClass', {
        width: '100%',
      }),     
    ]),
  ];
}
```

#### Key Frames

    Function helper.keyFrames(name, content)

To define your scopped keyframes animation with specefic name, use this helper function. 

| Param | Type | Default | Description |
| - | - | - | - |
| name | String | | Keyframes name. |
| content | Object | | Keyframes properties. If you don't pass this prop, calculated hash name of already generated keyframes will be returns. |

##### Example

```javascript
style({ keyFrames, className }) {
  return [
    className('animatedThing', {
      color: 'blue',
      animationName: keyFrames('myAnimation'),
      animationDuration: '2s',
    }),
    keyFrames('myAnimation', {
      from: {
        color: 'blue',
      },
      to: {
        color: 'red',
      },
    ]),
  ];
}
```

#### Custom

    Function helper.custom(rule, content)

To define your custom css style sections, use this helper function. **Note that styles generated by this helper function are not scopped!**

| Param | Type | Default | Description |
| - | - | - | - |
| rule | String | | Rule name. |
| content | Object | | Style properties. |

##### Example

```javascript
style({ custom }) {
  return [
    custom('@font-face', {
      fontFamily: 'globalFont',
      src: 'url(global_font.woff)',
    }),
  ];
}
```