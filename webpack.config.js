/* global __dirname */
/* generated by unstuck-webpack */

var path = require('path');
var webpack = require('webpack');
var dir_js = path.resolve(__dirname, 'app');
var dir_build = path.resolve(__dirname, 'dist');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
    entry: path.resolve(dir_js, 'index.js'),
    target : 'node',
    output: {
        path: dir_build,
        filename: 'bundle.js'
    },
    externals: nodeModules,
    resolve: {
       modulesDirectories: ['node_modules', dir_js],
    },
    devServer: {
        contentBase: dir_build,
    },
    stats: {
        colors: true,
        chunkModules: false
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],

    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/,
                presets : ['es2015']
            },
            {
                loader: 'file?name=/[name].html',
                test: /\.html$/
            }
        ]
    }
}