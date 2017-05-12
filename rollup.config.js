import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: [
        [
          'es2015', { modules: false },
        ],
      ],
      babelrc: false,
      plugins: ['external-helpers'],
      externalHelpers: true,
      exclude: 'node_modules/**',
    }),
  ],
  external: (id => id.indexOf('lodash') !== -1),
};
