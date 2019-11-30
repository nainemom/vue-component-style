function generateConfig(format) {
  const nameFormat = format === 'umd' ? '' : `.${format}`
  return {
    input: 'src/index.js',
    output: {
      file: `dist/vue-component-style${nameFormat}.js`,
      name: 'VueComponentStyle',
      format
    }
  }
}
module.exports = [
  generateConfig('umd'),
  generateConfig('cjs'),
  generateConfig('esm'),
];