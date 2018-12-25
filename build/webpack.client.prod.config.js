const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');

const srcDir = path.resolve(__dirname, '../dist').replace(/\\/g, "\/");
const prefixMulti = {};
prefixMulti[srcDir] = '';

module.exports = {
    devtool: false,
    mode: 'production',
    module: {
        rules: [{
            test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'static/img/[name].[ext]'
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader'])
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader'])
        }]
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new ExtractTextPlugin('static/css/[name].[hash:7].css'),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new SWPrecachePlugin({
            cacheId: 'fakerli-blog-vue-ssr',
            filename: 'service-worker.js',
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/server\.html$/, /admin\.html$/, /\.map$/],
            stripPrefixMulti: prefixMulti
        }),
        new HtmlWebpackPlugin({
            chunks: [
                'manifest', 'vendor', 'app'
            ],
            filename: 'server.html',
            template: 'src/template/server.html',
            inject: true,
            chunksSortMode(chunk1, chunk2) {
                let orders = ['manifest', 'vendor', 'app'];
                let order1 = orders.indexOf(chunk1.names[0]);
                let order2 = orders.indexOf(chunk2.names[0]);
                return order1 - order2;
            }
        }),
        new HtmlWebpackPlugin({
            chunks: [
                'manifest', 'vendor', 'admin'
            ],
            filename: 'admin.html',
            template: 'src/template/admin.html',
            inject: true,
            chunksSortMode(chunk1, chunk2) {
                let orders = ['manifest', 'vendor', 'admin'];
                let order1 = orders.indexOf(chunk1.names[0]);
                let order2 = orders.indexOf(chunk2.names[0]);
                return order1 - order2;
            }
        })
    ]
};