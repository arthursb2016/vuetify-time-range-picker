<template>
  <div
    class="time-range-picker-container"
    :class="{
      'full-width': bindings['full-width'],
    }"
  >
    <div
      class="d-flex"
      @mouseover="setHovering(true)"
      @mouseleave="setHovering(false)"
    >
      <v-select
        ref="startTime"
        v-model="startTime"
        :items="getTimes('start')"
        hide-details
        class="interval-select start-time"
        :class="getClassBindings('start')"
        :append-icon="startAppendIcon"
        :prefix="startPrefix"
        v-bind="vSelectBindings"
        @change="onChange"
        @focus="setFocusing('start')"
        @blur="setFocusing(null)"
      >
        <template
          v-if="inputLabel"
          #label
        >
          <span :class="{ [textColor]: focusing === 'end' }">
            {{ inputLabel }}
          </span>
        </template>
      </v-select>
      <v-select
        ref="endTime"
        v-model="endTime"
        :items="getTimes('end')"
        label=""
        hide-details
        class="interval-select end-time"
        :class="getClassBindings('end')"
        :append-icon="endAppendIcon"
        :prefix="endPrefix"
        v-bind="vSelectBindings"
        @change="onChange"
        @focus="setFocusing('end')"
        @blur="setFocusing(null)"
      />
      <!-- <slot name="append" /> -->
      <v-icon
        v-if="!hideOuterIcon && outerIcon"
        :color="outerIconColor"
        class="ml-1"
      >
        {{ outerIcon }}
      </v-icon>
    </div>
    <div
      v-show="!hideWholeDayCheckbox"
      class="whole-day"
    >
      <v-checkbox
        v-model="wholeDay"
        dense
        class="pt-0 mt-0"
        :label="wholeDayLabel"
        :readonly="wholeDay"
        :ripple="!wholeDay"
        :class="{
          'cursor-not-allowed': wholeDay,
        }"
        :disabled="vSelectBindings.disabled || false"
        :color="vSelectBindings.color || ''"
        :error="vSelectBindings.error || false"
        :light="vSelectBindings.light || false"
        :dark="vSelectBindings.dark || false"
        :messages="bindings['messages'] || ''"
        :error-count="bindings['error-count'] || 1"
        :error-messages="bindings['error-messages'] || ''"
        :hide-details="bindings['hide-details'] || false"
        :hint="bindings['hint'] || ''"
        :persistent-hint="showHint"
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

const ENABLED_BINDINGS = {
  COMPONENT: [
    'error-count',
    'error-messages',
    'full-width',
    'hide-details',
    'hint',
    'persistent-hint',
    'messages',
  ],
  SELECT: [
    'background-color',
    'color',
    'dark',
    'dense',
    'disable-lookup',
    'disabled',
    'eager',
    'error',
    'filled',
    'flat',
    'height',
    'hide-selected',
    'item-color',
    'light',
    'menu-props',
    'outlined',
    'rounded',
    'shaped',
    'solo',
    'solo-inverted',
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
    hideOuterIcon: {
      type: Boolean,
      default: () => false,
    },
    outerIcon: {
      type: String,
      default: () => 'access_time',
    },
    outerIconColor: {
      type: String,
      default: () => '',
    },
    startAppendIcon: {
      type: String,
      default: () => '',
    },
    endAppendIcon: {
      type: String,
      default: () => '',
    },
    disabledTimes: {
      type: [String, Array],
      default: () => [],
    },
    startPrefix: {
      type: String,
      default: () => '',
    },
    endPrefix: {
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
    isDark() {
      const isDarkTheme = this.$vuetify.theme.isDark;
      return (isDarkTheme && !this.vSelectBindings.light)
        || (!isDarkTheme && this.vSelectBindings.dark);
    },
    componentColor() {
      const theme = this.isDark ? 'dark' : 'light';
      const defaultColor = this.$vuetify.theme.defaults[theme].primary;
      return this.vSelectBindings.color || defaultColor;
    },
    bindings() {
      return this.getBindings('COMPONENT');
    },
    vSelectBindings() {
      return this.getBindings('SELECT');
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
      return !!this.focusing;
    },
    showHint() {
      return this.isFocusing || this.bindings['persistent-hint'];
    },
    computedDisabledTimes() {
      if (typeof this.disabledTimes === 'string') {
        return [this.disabledTimes];
      }
      return this.disabledTimes;
    },
    textColor() {
      const color = (this.vSelectBindings.color || '')
                      .split(/(?=[A-Z])/)
                      .join('-')
                      .toLowerCase() || 'primary';
      return `${color}--text`;
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
  },
  methods: {
    getTimes(name) {
      return this[`${name}Times`].map((time) => {
        return {
          text: time,
          value: time,
          disabled: this.computedDisabledTimes.includes(time),
        };
      });
    },
    getBindings(name) {
      const enabled = [...ENABLED_BINDINGS[name]];
      const filter = i => typeof this.$attrs[i] !== 'undefined';
      const reducer = (props, key) => {
        const value = this.$attrs[key] === '' ? true : this.$attrs[key];
        return {
          ...props,
          [key]: value,
        };
      }
      return enabled.filter(filter).reduce(reducer, {});
    },
    getClassBindings(input) {
      return {
        'hovering': this.isHovering && !this.isFocusing,
        'v-input--is-focused': this.isFocusing && this.focusing !== input,
        'v-select--is-menu-active': this.isFocusing && this.focusing !== input,
        [this.textColor]: this.isFocusing && this.focusing !== input,
      };
    },
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
    setFocusing(input) {
      this.focusing = input;
      if (this.focusing) return;
      this.$refs.startTime.blur();
      this.$refs.endTime.blur();
    },
    doubleDigit(digit) {
      if ((typeof digit === 'string' && digit.length === 1)
        || (typeof digit === 'number' && digit < 10)
      ) {
        return `0${digit}`;
      }
      return digit;
    },
    onWholeDayChange() {
      if (!this.wholeDay) return;
      this.startTime = '00:00';
      this.endTime = '23:59';
      this.onUpdate();
    },
    onChange() {
      this.setFocusing(this.focusing);
      this.onUpdate();
    },
    onUpdate() {
      this.$emit('update', {
        start: this.startTime,
        end: this.endTime,
      });
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
.time-range-picker-container {
  &.full-width {
    width: 100%;
  }
  .interval-select {
    &.start-time {
      ::v-deep fieldset {
        border-right: 0px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      ::v-deep .v-label {
        padding-right: 3px;
      }
      ::v-deep .v-input__control {
        /*border-right: 1px dashed gray;*/
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
      ::v-deep .v-input__control {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
    &.hovering {
      &.theme--dark {
        ::v-deep fieldset, ::v-deep .v-input__slot::before {
          border-color: rgba(255, 255, 255);
        }
      }
      &.theme--light {
        ::v-deep fieldset, ::v-deep .v-input__slot::before {
          border-color: rgba(0, 0, 0, 0.87);
        }
      }
    }
  }
  .whole-day {
    ::v-deep .v-input {
      float: left;
      .v-input__slot {
        transform: scale(0.75);
      }
      .v-messages {
        margin-left: 18px;
      }
      &.cursor-not-allowed {
        .v-label, input {
          cursor: not-allowed !important;
        }
      }
    }
  }
}
</style>
