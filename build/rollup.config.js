import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import scss from 'rollup-plugin-scss';

export default {
  input: 'src/index.js',
  output: {
    name: 'TimeRangePicker',
    exports: 'named',
  },
  plugins: [
    vue({
        css: true,
        compileTemplate: true,
    }),
    scss(),
    commonjs(),
    buble(),
  ],
};
