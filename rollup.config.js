import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
// import css from "rollup-plugin-css-only";

// PostCSS plugins
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

import { name } from "./package.json";

const Global = `var process = {
  env: {
    NODE_ENV: 'development'
  }
}`;

export default [
  {
    input: "build/index.js",
    output: [
      {
        exports: "named",
        file: `lib/${name}.cjs.js`,
        format: "cjs",
        banner: Global,
      },
      {
        exports: "named",
        file: `es/${name}.es.js`,
        format: "es",
        banner: Global,
      },
    ],
    plugins: [
      postcss({
        plugins: [
          simplevars(),
          nested(),
          cssnext({ warnForDuplicates: false }),
          cssnano(),
        ],
        extensions: [".css"],
      }),
      vue({
        css: true,
        // 把组件转换成 render 函数
        compileTemplate: true,
      }),
      nodeResolve({
        mainFields: ["module", "main"],
      }),
      commonjs({
        include: "node_modules/**",
      }),
      babel({
        exclude: "node_modules/**",
        presets: [
          [
            "@babel/env",
            {
              modules: false,
              targets: {
                browsers: "> 1%, IE 11, not op_mini all, not dead",
                node: 8,
              },
              corejs: "3.0",
              useBuiltIns: "usage",
            },
          ],
        ],
      }),
      terser(),
    ],
  },
];
