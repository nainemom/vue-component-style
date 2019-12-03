import mixin from './mixin';

export default {
  install(Vue, userOptions = {}) {
    const options = Object.assign(userOptions);
    if (!userOptions.documentObject && typeof document !== 'undefined') {
      options.documentObject = document;
    }
    Vue.mixin(mixin(options));
  },
};
