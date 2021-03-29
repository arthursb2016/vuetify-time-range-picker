import Vue from 'vue';
import vuetify from './plugins/vuetify';
import Demo from './Demo';

new Vue({
  vuetify,
  render: h => h(Demo)
}).$mount('#app')
