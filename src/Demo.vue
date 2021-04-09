<template>
  <v-app id="app">
    <div class="demo-container">
      <time-range-picker
        v-model="range"
        full-width
        hide-details
        hide-selected
        outlined
      />
    </div>
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
    return {
      range: {},
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.demo-container {
  padding: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
