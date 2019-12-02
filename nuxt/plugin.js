import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueComponentStyle from 'vue-component-style'; // eslint-disable-line import/no-extraneous-dependencies

export default ({ app: { head } }) => {
  Vue.use(VueComponentStyle, {
    head,
  });
};
