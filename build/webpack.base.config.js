const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isProd = process.env.NODE_ENV === 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
    // 性能提示
    // https://www.webpackjs.com/configuration/performance/
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning': false
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'static/js/[name].[chunkhash:7].js',
        chunkFilename: 'static/js/[name].[chunkhash:7].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/transform-runtime']
            }
        }],
        noParse: function(content) {
            return /jquery|lodash/.test(content);
        }
    },
    resolve:{
        extensions: [
            '.js', '.vue'
        ],
        modules: [
            path.join(__dirname, '../node_modules')
        ],
        alias: {
            '~src':path.resolve(__dirname, '../src'),
            '~components': path.resolve(__dirname, '../src/components'),
            '~api': path.resolve(__dirname, '../src/api/index-client'),
            '~pages': path.resolve(__dirname, '../src/pages'),
            '~filters': path.resolve(__dirname, '../src/filters'),
            '~mixins': path.resolve(__dirname, '../src/mixins'),
            '~store': path.resolve(__dirname, '../src/store'),
            '~utils': path.resolve(__dirname, '../src/utils'),
            '~assets': path.resolve(__dirname, '../src/assets'),
            '~api-config': path.resolve(__dirname, '../src/api/config-client')
        }
    },
    resolveLoader: {
        modules: [
            path.join(__dirname, '../node_modules')
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new VueLoaderPlugin()
    ]
};

!isProd && config.plugins.push(new FriendlyErrorsPlugin());
isProd && config.plugins.push(new BundleAnalyzerPlugin({
    analyzerHost: '0.0.0.0'
}));
module.exports = config;