const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')

const devConf = {
  entry: {
    app: './src/index.js',
  },
  devtool: '#inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
    ]
  },
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: "umd",
    library: "MqttLite"
  }
};

const proConf = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
}

module.exports = process.env.NODE_ENV == 'production' ? merge(devConf, proConf):devConf