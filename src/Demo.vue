<template>
  <v-app id="demo">
    <time-range-picker />
  </v-app>
</template>
<script>
import { VApp } from 'vuetify/lib';
import TimeRangePicker from './components/TimeRangePicker';

export default {
  name: 'Demo',
  components: {
    VApp,
    TimeRangePicker,
  },
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>

</style>
