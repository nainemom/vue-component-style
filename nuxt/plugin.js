import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueComponentStyle from 'vue-component-style'; // eslint-disable-line import/no-extraneous-dependencies

export default ({ app: { head: { style } } }) => {
  // eslint-disable-next-line no-underscore-dangle
  Vue.prototype._ssrAppObject = {
    head: {
      style,
    },
  };
  Vue.use(VueComponentStyle);
};
