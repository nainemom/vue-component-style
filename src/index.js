import mixin from './mixin';

export default {
  install(Vue, options = {}) {
    Vue.mixin(mixin(options));
  },
};
