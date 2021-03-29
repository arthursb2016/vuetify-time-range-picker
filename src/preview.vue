<template>
  <v-app>
    <time-range-picker />
  </v-app>
</template>
<script>
import { VApp } from 'vuetify/lib';
import TimeRangePicker from './time-range-picker';

export default {
  name: '',
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
