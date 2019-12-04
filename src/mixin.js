import {
  isUndefined, isFunction, isObject, makeError, hashCode,
} from './utils';
import { injectStylesheet, deleteStylesheet, componentCss } from './style';

export default {
  created() {
    this.$calcStyle();
  },
  methods: {
    $calcStyle() {
      const documentObject = typeof document !== 'undefined' ? document : undefined;
      // eslint-disable-next-line no-underscore-dangle
      const ssrAppObject = this._ssrAppObject;
      const vcsLastId = this.$vcsLastId;
      const propValue = this.$options.style;
      // delete old stylesheet if found
      // eslint-disable-next-line no-underscore-dangle
      if (!isUndefined(vcsLastId)) {
        deleteStylesheet(vcsLastId, documentObject, ssrAppObject);
      }

      if (isFunction(propValue)) {
        const value = propValue.call(this);
        const vcsId = hashCode(JSON.stringify(value));
        if (!isObject(value)) {
          // style is passed and it's function, but return value is not object
          makeError('\'style\' function should returns object!');
        }
        const css = componentCss(vcsId, value);
        injectStylesheet(vcsId, css.content, documentObject, ssrAppObject);
        this.$style = css.maps;
        this.$vcsLastId = vcsId;
        this.$forceUpdate();
        this.$nextTick(() => { // wait until component-style new class-names applied to component
          setTimeout(() => { // wait until component-style updates global style tag
            this.$emit('styleChange', this.$style);
          });
        });
      } else if (!isUndefined(propValue)) {
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
