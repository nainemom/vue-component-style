import Vue from 'vue';
import VueComponentStyle from 'vue-component-style';

export default ({ app: { head } }) => {
  Vue.use(VueComponentStyle, {
    head,
  });
};
