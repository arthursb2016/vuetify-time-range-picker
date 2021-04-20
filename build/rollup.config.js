import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import scss from 'rollup-plugin-scss';
import vuetify from 'rollup-plugin-vuetify';

export default {
  input: 'src/index.js',
  output: {
    name: 'TimeRangePicker',
    exports: 'named',
    globals: {
      'vue': 'Vue',
    },
  },
  external: ['vue', 'vuetify/lib'],
  plugins: [
    commonjs({
      include: /node_modules/,
    }),
    scss(),
    vue({
      css: true,
      compileTemplate: true,
    }),
    vuetify(),
    buble({
      objectAssign: 'Object.assign',
      transforms: { forOf: false }
    }),
  ],
};
