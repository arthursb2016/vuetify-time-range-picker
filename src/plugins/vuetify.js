import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify, { VApp } from 'vuetify/lib';

Vue.use(Vuetify, {
  components: {
    VApp,
  },
});

const opts = {
  icons: {
    iconfont: 'md',
  },
};

export default new Vuetify(opts);
