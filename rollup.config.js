import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

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
