<template>
  <v-app id="app">
    <time-range-picker />
  </v-app>
</template>
<script>
import TimeRangePicker from './components/TimeRangePicker';

export default {
  name: 'Demo',
  components: {
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
