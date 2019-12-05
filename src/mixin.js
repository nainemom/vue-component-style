import {
  typeOf, makeError, hashCode,
} from './utils';
import { injectStylesheet, deleteStylesheet, componentCss } from './style';

export default {
  created() {
    this.$calcStyle();
  },
  methods: {
    $calcStyle() {
      const documentObject = typeof document !== 'undefined' ? document : undefined;
      const ssrAppObject = this._ssrAppObject;
      const lastStyleId = this.$lastStyleId;
      const propValue = this.$options.style;
      // delete old stylesheet if found
      if (typeOf(lastStyleId) !== 'Undefined') {
        deleteStylesheet(lastStyleId, documentObject, ssrAppObject);
      }

      if (typeOf(propValue) === 'Function') {
        const value = propValue.call(this);
        const styleId = hashCode(JSON.stringify(value));
        if (typeOf(value) !== 'Object') {
          // style is passed and it's function, but return value is not object
          makeError('\'style\' function should returns object!');
        }
        const css = componentCss(styleId, value);
        injectStylesheet(styleId, css.content, documentObject, ssrAppObject);
        this.$style = css.maps;
        this.$lastStyleId = styleId;
        this.$forceUpdate();
        this.$nextTick(() => { // wait until component-style new class-names applied to component
          setTimeout(() => { // wait until component-style updates global style tag
            this.$emit('styleChange', this.$style);
          });
        });
      } else if (typeOf(propValue) !== 'Undefined') {
        // style is passed, but with wrong value
        makeError('\'style\' should be function!');
      }
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
