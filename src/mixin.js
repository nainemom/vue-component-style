export default {
  computed: {
    $style () {
      return this._style
    }
  },
  beforeCreate() {
    const isObject = x => typeof x === 'object' && x !== null && x.toString() === '[object Object]'
    const isFunction = x => typeof x === 'function'
    const isUndefined = x => typeof x === 'undefined'
    const value = this.$options.style

    if (isUndefined(value)) {
      this._style = {}
    } else if (isFunction(value)) {
      const res = value.call(this)
      if (isObject(res)) {
        // calculate
        this._style = res
      } else {
        // style is passed and it's function, but return value is not object
        throw new Error('VueComponentStyle: \'style\' function in component should returns array!')
      }
    } else {
      // style is passed, but with wrong value
      throw new Error('VueComponentStyle: \'style\' key in component isn\'t function!')
    }
  }
}