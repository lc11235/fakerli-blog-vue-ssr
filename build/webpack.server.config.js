const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRPlugin = require('vue-ssr-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const base = require('./webpack.base.config');

let query = {};
if(process.env.NODE_ENV === 'production') {
    query = {
        limit: 10000,
        name: 'static/img/[name].[hash:7].[ext]'
    };
}

const config = merge(base, {
    target: 'node',
    devtool: false,
    entry: './src/entry-server.js',
    output: {
        filename: 'server/server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
            loader: 'url-loader',
            query
        }]
    },
    resolve: {
        alias: {
            '~api': path.resolve(__dirname, '../src/api/index-server'),
            '~api-config': path.resolve(__dirname, '../src/api/config-server')
        }
    },
    node: {
        __dirname: true
    },
    externals: Object.keys(require('../package.json').dependencies),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.NODE_ENV': '"server"',
            'global.GENTLY': false
        }),
        new VueSSRPlugin(),
        new VueLoaderPlugin()
    ]
});

module.exports = config;
