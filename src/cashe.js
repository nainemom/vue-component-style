export default new (class {
  constructor () {
    this.cache = [];
  }

  add (name, hash) {
    this.cache.push({
      name,
      hash,
    })
  }

  get (value, key = 'hash') {
    return this.cache.find(x => x[key] === value)
  }

  name (prefix) {
    let i = 1
    while (this.get(`${prefix}-${i}`, 'name')) {
      i++
    }
    return `${prefix}-${i}`
  }

  hash (v) {
    return JSON.stringify(v)
  }

})