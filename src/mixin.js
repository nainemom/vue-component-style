import {
  isUndefined, isFunction, isObject, makeError,
} from './utils';
import componentStyle from './component-style';

export default () => ({
  created() {
    this.$calcStyle();
  },
  methods: {
    $calcStyle() {
      const propValue = this.$options.style;
      if (isFunction(propValue)) {
        const value = propValue.call(this);
        if (isObject(value)) {
          this.$style = componentStyle(value);
        } else {
          // style is passed and it's function, but return value is not object
          makeError('\'style\' function in component should returns object!');
        }
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
});
