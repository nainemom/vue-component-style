import {
  isUndefined, isFunction, isObject, makeError, hashCode,
} from './utils';
import { createStylesheet, componentCss } from './style';

export default {
  created() {
    this.$calcStyle();
  },
  methods: {
    $calcStyle(styleSsrArray = undefined) {
      const isServer = typeof process !== 'undefined' && !process.client;
      const isClient = typeof document !== 'undefined';
      const propValue = this.$options.style;
      // remove old stylesheet if found
      // eslint-disable-next-line no-underscore-dangle
      const lastVcsid = ((this.$style || {})._vcsid || false);
      if (lastVcsid && isClient) {
        const lastStylesheet = document.querySelector(`style[data-vcsid="${lastVcsid}"]`);
        if (lastStylesheet) {
          lastStylesheet.remove();
        }
      }
      if (isFunction(propValue)) {
        const value = propValue.call(this);
        // oh men
        const vcsid = hashCode(JSON.stringify(value));
        if (!isObject(value)) {
          // style is passed and it's function, but return value is not object
          makeError('\'style\' function in component should returns object!');
        }
        const css = componentCss(vcsid, value);
        const stylesheet = createStylesheet(
          vcsid,
          css.content,
          !isClient || (isServer && !isUndefined(styleSsrArray)),
        );
        if (isServer && typeof styleSsrArray !== 'undefined') {
          /* TODO: make it works on ssr */
          styleSsrArray.push(stylesheet);
        }
        if (isClient) {
          document.head.appendChild(stylesheet);
        }
        this.$style = {
          ...css.maps,
          // eslint-disable-next-line no-undef
          _vcsid: vcsid,
        };
      } else if (isUndefined(propValue)) {
        this.$style = {};
      } else {
        // style is passed, but with wrong value
        makeError('\'style\' key in component isn\'t function!');
      }
      this.$forceUpdate();
      this.$nextTick(() => { // wait until component-style new class-names applied to component
        setTimeout(() => { // wait until component-style updates global style tag
          this.$emit('styleChange', this.$style);
        });
      });
    },
  },
  watch: {
    $data: {
      deep: true,
      handler() {
        this.$calcStyle();
      },
    },
    $props: {
      deep: true,
      handler() {
        this.$calcStyle();
      },
    },
  },
};
