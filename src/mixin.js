import {
  typeOf, makeError,
} from './utils';
import { injectStylesheet, deleteStylesheet, Helper } from './style';

export default {
  created() {
    this.$calcStyle();
  },
  computed: {
    $styleId() {
      return `${Math.floor(99999 * Math.random())}${Date.now()}`.padStart(18, 0);
    },
    $styleHelper() {
      return Helper(this.$styleId);
    },
  },
  watch: {
    style() {
      this.$calcStyle();
    },
  },
  methods: {
    $calcStyle() {
      const propValue = this.$options.computed.style;
      if (typeOf(propValue) !== 'Undefined') {
        const documentObject = typeof document !== 'undefined' ? document : undefined;
        const ssrAppObject = this._ssrAppObject;
        const lastStyleId = this.$lastStyleId;
        // delete old stylesheet if found
        if (typeOf(lastStyleId) !== 'Undefined') {
          deleteStylesheet(lastStyleId, documentObject, ssrAppObject);
        }

        if (typeOf(propValue) === 'Function') {
          const value = this.style;
          if (typeOf(value) !== 'Array') {
            // style is passed and it's function, but return value is not object
            makeError('\'style\' function should returns Array!');
          }
          const css = value.join('');
          injectStylesheet(this.$styleId, css, documentObject, ssrAppObject);
          this.$style = this.$styleHelper.maps;
          this.$lastStyleId = this.$styleId;
          this.$forceUpdate();
          this.$nextTick(() => { // wait until component-style new class-names applied to component
            setTimeout(() => { // wait until component-style updates global style tag
              this.$emit('styleChange', this.$style);
            });
          });
        } else {
          // style is passed, but with wrong value
          makeError('\'style\' should be function!');
        }
      }
    },
  },
};
