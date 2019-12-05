# Vue Component Style

A `Vue` mixin to add `style` section in components to inject `Javascript` in your styles.

---

## Features

- Zero Dependency
- Tiny (~1kb gzipped)
- Simple Setup and Usage
- SSR Support

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
      Content <a> Link </b>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 8,
    },
    color: {
      type: String,
      default: 'red',
    }
  },
  style() {
    return {
      title: {
        color: this.color,
        fontWeight: 'bold',
        padding: `${this.size * 2}px`,
        borderRadius: `${this.size}px`,
      },
      content: {
        marginBottom: `${this.size}px`,
        '& > a': {
          backgroundColor: this.color,
        }
      }
    }
  }
}
</script>
```

---

## API Documentions

### style: _Function_
After activating **VueComponentStyle**, all components can have their js **style** section. Just like **data** section, you have to pass normal function that returning plain object:

```javascript
style() {
  return {
    [objectName]: {
      [cssProp]: [cssValue]
    },
    ...
  }
}
```
**[objectName]**: _String_

Name of your object.

**[cssProp]**: _String_

Any CSS property. dash-cased of camelCased.

**[cssValue]**: _String_

CSS prop value. with String type or anything convertable to String.

### $style: _Object_
After you defining **style** prop in your component, all your [objectName]s are accessable with **$style** computed object inside your component instance. Value of **$style** object keys is calculated CSS class of your object.

### styleChange: _Vue Event_

**styleChange** event fires when your style changes and applied to DOM.
