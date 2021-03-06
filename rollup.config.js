import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

// 目前的实践表明，rollup打包库非常友好，D3、ThreeJS等都是基于rollUp打包
export default {
  entry: "src/index.js",
  exports: "named",
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          "es2015",
          {
            modules: false
          }
        ]
      ],
      plugins: ["external-helpers"]
    }),
    commonjs({
      include: "node_modules/**"
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    })
  ],
  targets: [
    {
      format: "umd",
      moduleName: "reduxLogger",
      dest: "dist/redux-logger.js"
    },
    {
      format: "es",
      dest: "dist/redux-logger.es.js"
    }
  ]
};
