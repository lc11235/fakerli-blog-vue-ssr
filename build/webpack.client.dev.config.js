const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: '#source-map',
    mode: 'development',
    module: {
        rules: [{
            test: /\.css$/,
            loader: 'vue-style-loader!css-loader!postcss-loader'
        }, 
        {
            test: /\.less$/,
            loader: 'vue-style-loader!css-loader!postcss-loader'
        }, 
        {
            test: /\.less$/,
            loader: 'less-loader',
            options: {
                javascriptEnabled: true
            }
        },
        {
            test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
            loader: 'url-loader',
            query: {
                name: '[name].[hash:7].[ext]'
            }
        }]
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.optimize.SplitChunksPlugin({
            chunks: "all",
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true
        }),
        new HtmlWebpackPlugin({
            chunks: [
                'vendor', 'app'
            ],
            filename: 'server.html',
            template: 'src/template/server.html',
            inject: true,
            chunksSortMode: 'none'
        }),
        new HtmlWebpackPlugin({
            chunks:[
                'vendor', 'admin'
            ],
            filename: 'admin.html',
            template: 'src/template/admin.html',
            inject: true,
            chunksSortMode: 'none'
        })
        // https://github.com/jantimon/html-webpack-plugin/issues/895
    ]
};