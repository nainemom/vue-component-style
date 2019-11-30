import { isUndefined, isFunction, isObject } from './utils';
import componentStyle from './component-style';

export default (options = {}) => ({
  computed: {
    $style () {
      return this._style
    }
  },
  beforeCreate() {
    const value = this.$options.style

    if (isUndefined(value)) {
      this._style = {}
    } else if (isFunction(value)) {
      const res = value.call(this)
      if (isObject(res)) {
        // calculate
        // options.head
        this._style = componentStyle(res, options.head || [])
      } else {
        // style is passed and it's function, but return value is not object
        throw new Error('VueComponentStyle: \'style\' function in component should returns array!')
      }
    } else {
      // style is passed, but with wrong value
      throw new Error('VueComponentStyle: \'style\' key in component isn\'t function!')
    }
  }
})