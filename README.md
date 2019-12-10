# Vue Component Style

A `Vue` mixin to add `style` section in components with `Javascript` syntax.

---

## Features

- Zero Dependency
- Tiny (~1kb gzipped)
- Simple Setup and Usage
- Nested Support
- Pseudo Selector Support
- SSR Support
- Scoped to Component

---

## Install

```bash
npm i vue-component-style
# or with yarn
yarn add vue-component-style
```

---

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
  // ...
  modules: [
    'vue-component-style/nuxt'
  ],
  // ...
}
```

Note that You don't need to do anything else with your webpack config or whatever.

---

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
        padding: `${this.size * 2}px`,
        borderRadius: `${this.size}px`
      }),
      className('content', {
        marginBottom: `${this.size}px`,
        '& > a': {
          backgroundColor: this.color,
          '&:visited': {
            backgroundColor: 'transparent'
          }
        }
      })
    ];
  }
}
</script>
```

---

## API Documentions

### style: _Function_
After activating **VueComponentStyle**, all components can have their js **style** section. Just like **data** section, you have to pass normal function that returning an Array. This function will invoke inside of **VueComponentStyle** with **helper** util object.

Example:
```javascript
style(helper) {
  const { className } = className;
  return [
    className(name, objectContent),
    ...
  ]
}
```

### helper: _Object_
You can use **helper** object from first parameter of **style** function to defining your stylesheet.

#### helper.className: _Function_ (name: _String_, content: _Object_)
To define a class style, use this. Your defined name from first parameter will accessable from **$style**.

#### helper.mediaQuery: _Function_ (mediaFeatures: _Object_, content: _Array_)
To define custom stylesheet for specefic screen size, use this. Note that you can also use **className** function inside content Array to redefine class style.

**[cssProp]**: _String_

Any CSS property. dash-cased of camelCased.

**[cssValue]**: _String_

CSS prop value. with String type or anything convertable to String.

### $style: _Object_
After you defining **style** prop in your component, all your [objectName]s are accessable with **$style** computed object inside your component instance. Value of **$style** object keys is calculated CSS class of your object.

### styleChange: _Vue Event_

**styleChange** event fires when your style changes and applied to DOM.
