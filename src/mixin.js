import { isUndefined, isFunction, isObject } from './utils';
import componentStyle from './component-style';

export default (options = {}) => ({
  created() {
    this.$calcStyle()
  },
  methods: {
    $calcStyle() {
      const propValue = this.$options.style
      if (isFunction(propValue)) {
        const value = propValue.call(this)
        if (isObject(value)) {
          this.$style = componentStyle(value)
        } else {
          // style is passed and it's function, but return value is not object
          throw new Error('VueComponentStyle: \'style\' function in component should returns object!')
        }
      } else if (isUndefined(propValue)) {
        this.$style = {}
      } else {
        // style is passed, but with wrong value
        throw new Error('VueComponentStyle: \'style\' key in component isn\'t function!')
      }
      this.$forceUpdate()
    }
  },
  watch: {
    $data: {
      deep: true,
      handler() {
        this.$calcStyle()
      }
    }
  }
})