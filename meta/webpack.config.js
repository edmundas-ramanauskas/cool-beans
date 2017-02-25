var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  bail: true,
  entry: [
    './src/index.jsx'
  ],
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        loader: 'babel-loader',
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
    path: path.join(__dirname, '../build'),
    crossOriginLoading: 'anonymous',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
      title: 'Cool Beans',
			template: './src/index.html',
      inject: false,
      // minify: {
      //   collapseWhitespace: true,
      //   removeComments: true
      // },
		}),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: /license/,
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new ExtractTextPlugin('styles.css'),
	],
  resolve: {
		extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'src']
	}
};

module.exports = config;
