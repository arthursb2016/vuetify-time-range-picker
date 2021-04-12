# vuetify-time-range-picker

A time range picker based on [Vuetify](https://vuetifyjs.com/), made so users can easily pick a one day time interval.

![Demo](images/demo.gif?raw=true)

## Installation

#### NPM
```bash
npm i vuetify-time-range-picker
```

#### YARN
```
yarn add vuetify-time-range-picker
```

## Usage
Dependencies: [Vue](https://vuejs.org/) and [Vuetify](https://vuetifyjs.com/)

#### JavaScript
```javascript
// main.js
import Vue from 'vue';
import vuetify from '@/plugins/vuetify'; // path to vuetify export

new Vue({
  vuetify,
}).$mount('#app');

// Component.vue
import TimeRangePicker from 'vuetify-time-range-picker';

export default {
  ...,
  components: {
    TimeRangePicker,
  },
};

```

#### HTML
```html
<template>
  <v-app id="app">
    <time-range-picker
      v-model="range"
      full-width
      hide-details
      hide-selected
      outlined
      step="30"
    />
  </v-app>
</template>
```
## Props

| Name  | Type | Description | Default Value |
| ------------- |:-------------:|:-------------:|:-------------:|
| range | Object  | An object used as v-model containing 'start' and 'end' | { start: '00:00', end: '23:59' } |
| inputLabel | String  | Input label text | 'Interval' |
| wholeDayLabel  | String  | Whole day checkbox label text | 'Whole day' |
| step |String, Number | Interval of minures between available times | 15 |
| outerIcon | String | Outer vuetify v-icon default slot | 'access_time' |
| outerIconColor | String | Outer vuetify v-icon color prop | '' |
| startAppendIcon | String | Start time append icon | '' |
| endAppendIcon | String | End time append icon | '' |
| startPrefix | String | Start time prefix text | '' |
| endPrefix | String | End time prefix text | ''|
| disabledTimes | String, Array | Disabled times for both inputs | [] |
| innerDivCustomClass | String | Custom CSS classes to be added at input's wrapper | '' |
| noInputSeparator | Boolean | Hides the separator between start and end input | false |
| hideWholeDayCheckbox | Boolean | Hides whole day option | false |
| hideOuterIcon | Boolean | Hides outer v-icon | false |


Besides you can also pass most of the [v-select props](https://vuetifyjs.com/en/api/v-select/#props). The enabled ones are:

`error-count` `error-messages` `full-width` `hide-details` `hint` `persistent-hint` `messages` `success-messages` `background-color` `color` `dark` `dense` `disable-lookup` `disabled` `eager` `error` `filled` `flat` `height` `hide-selected` `item-color` `light` `menu-props` `outlined` `rounded` `shaped` `solo` `solo-inverted` `success`

## Slots

| Name  | Description |
| ------------- |:-------------:|
| append | Replaces the default v-icon outside the input |

## Events

| Name  | Description |
| ------------- |:-------------:|
| update | Updates the v-model value |
| mouseover | Emitted at input mouseover |
| mouseleave | Emitted at input mouseleave |
| focus | Emitted at input focus |
| blur | Emitted at input blur |

## Examples

To be done...

## License
[MIT](https://choosealicense.com/licenses/mit/)