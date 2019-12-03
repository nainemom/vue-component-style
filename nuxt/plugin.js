import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueComponentStyle from 'vue-component-style'; // eslint-disable-line import/no-extraneous-dependencies

export default ({ app: { head } }) => {
  console.log('plugin called!', {
    headObject: typeof document === 'undefined' ? head : undefined,
    documentObject: typeof document !== 'undefined' ? document : undefined,
  });
  Vue.use(VueComponentStyle, {
    headObject: typeof document === 'undefined' ? head : undefined,
    documentObject: typeof document !== 'undefined' ? document : undefined,
  });
};
