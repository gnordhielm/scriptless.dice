const path = require('path')
const webpack = require('webpack')

process.noDeprecation = true

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  externals: {
    "react": "react",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader', 
          'css-loader',
          'sass-loader', 
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    })
  ],
  resolve: {
    alias: {
      components: path.resolve(process.cwd(), 'src/components/'),
      interfaces: path.resolve(process.cwd(), 'src/interfaces/'),
      utils: path.resolve(process.cwd(), 'src/utils/'),
    },
    extensions: [
      '.js',
      '.jsx',
      '.json',
    ],
  },
  target: 'web',
  node: {
    fs: 'empty',
    module: 'empty',
    net: 'empty',
  },
}