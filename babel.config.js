const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'build';

const presets = [];
const plugins = [];

switch (env) {
  case 'build':
  default:
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]);
    break;
}

export default { presets, plugins }
