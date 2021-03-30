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
        dense
        append-icon=""
        hide-details
        class="interval-select start-time"
        :class="{
          'hovering': isHovering,
          'focusing': isFocusing,
        }"
        :disabled="disabled"
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
        dense
        append-icon=""
        hide-details
        class="interval-select end-time"
        :class="{
          'hovering': isHovering,
          'focusing': isFocusing,
        }"
        :disabled="disabled"
        @change="onChange"
        @focus="setFocusing(true)"
        @blur="setFocusing(false)"
      />
      <v-icon
        color="orange"
        class="ml-1"
      >
        access_time
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
        :disabled="disabled"
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

export default {
  name: 'TimeRangePicker',
  components: {
    VSelect,
    VIcon,
    VCheckbox,
  },
  mixins: [],
  props: {
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
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      startTime: '00:00',
      endTime: '23:59',
      hovering: false,
      focusing: false,
      wholeDay: true,
    };
  },
  computed: {
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
      return this.times.slice(1, this.times.length).concat(['23:59']).filter(filter);
    },
    isHovering() {
      return this.hovering;
    },
    isFocusing() {
      return this.focusing;
    },
  },
  watch: {
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
    this.startTime = '00:00';
    this.endTime = '23:59';
    this.onUpdate();
  },
  methods: {
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
        startTime: this.startTime,
        endTime: this.endTime,
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
