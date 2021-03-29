import Vuetify, {
  VSelect,
  VIcon,
  VCheckbox,
} from 'vuetify/lib';
import TimeRangePicker from './time-range-picker.vue';

export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.use(Vuetify, {
    components: {
      VSelect,
      VIcon,
      VCheckbox,
    },
    directives: {
      Ripple,
    },
  });
  Vue.component('TimeRangePicker', TimeRangePicker);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default TimeRangePicker;
