<template>
  <div>
    <div
      class="d-flex"
      @mouseover="setHovering(true)"
      @mouseleave="setHovering(false)"
    >
      <v-select
        ref="startTime"
        v-model="startTime"
        :items="startTimes"
        :label="inputLabel"
        rounded
        outlined
        hide-details
        class="interval-select start-time"
        :class="{
          'hovering': isHovering,
          'focusing': isFocusing,
        }"
        :append-icon="startAppendIcon"
        @change="onChange"
        @focus="setFocusing(true)"
        @blur="setFocusing(false)"
      />
      <v-select
        ref="endTime"
        v-model="endTime"
        :items="endTimes"
        label=""
        rounded
        outlined
        hide-details
        class="interval-select end-time"
        :class="{
          'hovering': isHovering,
          'focusing': isFocusing,
        }"
        :append-icon="endAppendIcon"
        @change="onChange"
        @focus="setFocusing(true)"
        @blur="setFocusing(false)"
      />
      <!-- <slot name="append" /> -->
      <v-icon
        v-if="!hideIcon && icon"
        color="orange"
        class="ml-1"
      >
        {{ icon }}
      </v-icon>
    </div>
    <div
      v-show="!hideWholeDayCheckbox"
      class="whole-day"
    >
      <v-checkbox
        v-model="wholeDay"
        dense
        color="orange"
        class="pt-0 mt-0"
        :label="wholeDayLabel"
        hide-details
        :readonly="wholeDay"
        :ripple="!wholeDay"
        :class="{
          'cursor-not-allowed': wholeDay,
        }"
        :disabled="props.disabled"
        @change="onWholeDayChange"
      />
    </div>
  </div>
</template>
<script>
import {
  VSelect,
  VIcon,
  VCheckbox,
} from 'vuetify/lib';

const DEFAULT_STEP = 15;
const DEFAULT_START_TIME = '00:00';
const DEFAULT_END_TIME = '23:59';

const ENABLED_PROPS = {
  V_SELECT: [
    'background-color',
    'color',
    'dark',
    'dense',
    'disable-lookup',
    'disabled',
    'eager',
  ],
};

export default {
  name: 'TimeRangePicker',
  components: {
    VSelect,
    VIcon,
    VCheckbox,
  },
  mixins: [],
  props: {
    range: {
      type: Object,
      default: () => {},
    },
    inputLabel: {
      type: String,
      default: () => 'Interval',
    },
    wholeDayLabel: {
      type: String,
      default: () => 'Whole day',
    },
    step: {
      type: [String, Number],
      default: () => DEFAULT_STEP,
    },
    hideWholeDayCheckbox: {
      type: Boolean,
      default: () => false,
    },
    hideIcon: {
      type: Boolean,
      default: () => false,
    },
    icon: {
      type: String,
      default: () => 'access_time',
    },
    startAppendIcon: {
      type: String,
      default: () => '',
    },
    endAppendIcon: {
      type: String,
      default: () => '',
    },
  },
  model: {
    prop: 'range',
    event: 'update',
  },
  data() {
    return {
      startTime: DEFAULT_START_TIME,
      endTime: DEFAULT_END_TIME,
      hovering: false,
      focusing: false,
      wholeDay: true,
    };
  },
  computed: {
    props() {
      const enabled = [...ENABLED_PROPS.V_SELECT];
      const filter = i => typeof this.$attrs[i] !== 'undefined';
      const reducer = (props, value) => {
        return {
          ...props,
          [value]: this.$attrs[value],
        };
      }
      return enabled.filter(filter).reduce(reducer, {});
    },
    times() {
      const maxHour = 24;
      const maxMin = 59;
      const parsedStep = parseInt(this.step, 10);
      const step = parsedStep >= maxMin ? DEFAULT_STEP : parsedStep;
      const times = [];
      let hh = 0;
      while (hh < maxHour) {
        let mm = 0;
        while (mm < maxMin) {
          times.push(`${this.doubleDigit(hh)}:${this.doubleDigit(mm)}`);
          mm += step;
        }
        hh += 1;
      }
      return times;
    },
    startTimes() {
      return this.times.slice(0, this.times.length);
    },
    endTimes() {
      const filter = endTime => this.isGreater(endTime);
      return this.times.slice(1, this.times.length)
        .concat([DEFAULT_END_TIME])
        .filter(filter);
    },
    isHovering() {
      return this.hovering;
    },
    isFocusing() {
      return this.focusing;
    },
  },
  watch: {
    range: {
      deep: true,
      handler() {
        const inputRange = {
          start: this.startTime,
          end: this.endTime,
        };
        if (JSON.stringify(this.range) === JSON.stringify(inputRange)) {
          return;
        }
        this.initValues();
      },
    },
    startTime() {
      this.checkWholeDay();
      this.$nextTick(() => {
        if (!this.endTimes.find(t => t === this.endTime)) {
          // eslint-disable-next-line
          this.endTime = this.endTimes[0];
        }
      });
    },
    endTime() {
      this.checkWholeDay();
    },
  },
  mounted() {
    this.initValues();
    console.log(this.props);
  },
  methods: {
    initValues() {
      const finder = time => (i) => i === time;
      const start = this.startTimes.find(finder(this.range.start));
      const end = this.endTimes.find(finder(this.range.end));
      this.startTime = start || DEFAULT_START_TIME;
      this.endTime = end || DEFAULT_END_TIME;
      if (start && end) return;
      this.onUpdate();
    },
    setHovering(hovering) {
      this.hovering = hovering;
    },
    setFocusing(focusing) {
      this.focusing = focusing;
      if (!focusing) {
        this.$refs.startTime.blur();
        this.$refs.endTime.blur();
      }
    },
    doubleDigit(digit) {
      if ((typeof digit === 'string' && digit.length === 1)
        || (typeof digit === 'number' && digit < 10)
      ) {
        return `0${digit}`;
      }
      return digit;
    },
    onChange() {
      this.focusing = true;
      this.onUpdate();
    },
    onUpdate() {
      this.$emit('update', {
        start: this.startTime,
        end: this.endTime,
      });
    },
    onWholeDayChange() {
      if (!this.wholeDay) return;
      this.startTime = '00:00';
      this.endTime = '23:59';
    },
    checkWholeDay() {
      if (this.startTime === '00:00' && this.endTime === '23:59') {
        this.wholeDay = true;
        return;
      }
      this.wholeDay = false;
    },
    isGreater(endTime) {
      const d1 = new Date();
      const startHour = parseInt(this.startTime.split(':')[0], 10);
      const startMinute = parseInt(this.startTime.split(':')[1], 10);
      d1.setHours(startHour);
      d1.setMinutes(startMinute);
      d1.setSeconds(0);
      const d2 = new Date();
      const endHour = parseInt(endTime.split(':')[0], 10);
      const endMinute = parseInt(endTime.split(':')[1], 10);
      d2.setHours(endHour);
      d2.setMinutes(endMinute);
      d2.setSeconds(0);
      return d2 > d1;
    },
  },
};
</script>
<style lang="scss" scoped>
.interval-select {
  &.start-time {
    ::v-deep fieldset {
      border-right: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    ::v-deep .v-label {
      background: white;
      padding-right: 3px;
    }
    ::v-deep .v-input__control {
      border-right: 1px dashed gray;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
  &.end-time {
    ::v-deep fieldset {
      border-left: 0px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }
  &.hovering {
    ::v-deep fieldset {
      border-color: gray;
    }
  }
  &.focusing {
    ::v-deep fieldset {
      border-width: 2px;
      border-color: blue;
    }
  }
}
.v-select {
  font-size: 0.75rem;
}
.whole-day {
  ::v-deep .v-input {
    transform: scale(0.75);
    float: left;
    &.cursor-not-allowed {
      .v-label, input {
        cursor: not-allowed !important;
      }
    }
  }
}
</style>
