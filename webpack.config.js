const path = require('path');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const config = {
  module: {
    rules: [
      {
        test: /\.pem$/i,
        use: 'raw-loader',
        exclude: /node_modules/,
      },
      {
        loader: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
      },
      {
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
        exclude: /node_modules/,

        options: {
          plugins: ['syntax-dynamic-import'],

          presets: [
            [
              '@babel/preset-env',
              {
                modules: false
              }
            ]
          ]
        },

        test: /\.js$/
      }
    ]
  },


  resolve: {
    extensions: ['.ts', '.js']
  },

  mode: 'production',

  entry: './src/index.ts',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'commonjs2',
  },
};

module.exports = [
  config,
  {
    ...config,
    target: 'node',
    entry: './src/inject-envs.ts',

    output: {
      ...config.output,
      filename: 'inject-envs.js',
    }
  }
];
