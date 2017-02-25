var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  bail: true,
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    noInfo: true,
    port: 3000,
    publicPath: '/'
  },
  devtool: 'source-map',
  entry: [
		'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        loaders: ['react-hot-loader/webpack', 'babel-loader'],
        include: path.join(__dirname, '../src')
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]!postcss-loader'
        })
      },
      {
        test: /\.(png|svg|gif)$/,
        loaders: [
          'url-loader',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: 'bundle.js'
  },
  plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({React: 'react'}),
		new HtmlWebpackPlugin({
      title: 'Cool Beans',
			template: './src/index.html',
      inject: false
		}),
    new ExtractTextPlugin('styles.css'),
	],
  resolve: {
		extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'src']
	},
  target: 'web'
};

module.exports = config;
