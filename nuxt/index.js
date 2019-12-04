import path from 'path';

export default function VueComponentStyle() {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
  });
}
