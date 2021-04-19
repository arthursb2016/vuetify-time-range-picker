import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import sass from 'rollup-plugin-sass';
import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
import vuetify from 'rollup-plugin-vuetify';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    name: 'TimeRangePicker',
    exports: 'named',
  },
  external: ['vue', 'vuetify/lib'],
  plugins: [
    postcss(),
    nodeResolve(),
    commonjs({
      include: 'node_modules',
    }),
    scss(),
    sass(),
    vue(),
    vuetify(),
    buble({
      objectAssign: 'Object.assign',
    }),
  ],
};
