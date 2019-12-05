import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueComponentStyle from 'vue-component-style'; // eslint-disable-line import/no-extraneous-dependencies

export default ({ app: { head: { style } } }) => {
  Vue.prototype._ssrAppObject = {
    head: {
      style,
    },
  };
  Vue.use(VueComponentStyle);
};
