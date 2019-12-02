import path from 'path';

export default function VueComponentStyle() {
  // Write your code here
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
  });
}
