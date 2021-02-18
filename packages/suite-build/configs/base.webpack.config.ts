import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import env from '../environment/env';
import isDev from '../environment/is-dev';
import isAnalyzing from '../environment/analyze';
import assetPrefix from '../environment/prefix';
import alias from '../utils/alias';

const config: webpack.Configuration = {
    mode: env,
    target: isDev ? 'web' : 'browserslist',
    devtool: isDev ? 'source-map' : false,
    devServer: {
        writeToDisk: true,
        port: 3000,
        hot: isDev, // HMR
    },
    output: {
        publicPath: `${assetPrefix}/`,
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[id].[contenthash:8].js',
        assetModuleFilename: `assets/[hash][ext][query]`,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules'],
        alias,
        fallback: {
            // Polyfills API for NodeJS libraries in the browser
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            process: require.resolve('process'),
            // For Google OAuth library to work
            child_process: false,
            fs: false,
            net: false,
            tls: false,
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                react: {
                    chunks: 'initial',
                    name: 'react',
                    test: /[\\/]node_modules[\\/]react/,
                },
                vendors: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/](?!react)/,
                },
                components: {
                    chunks: 'initial',
                    name: 'components',
                    test: /[\\/]packages[\\/]components[\\/]/,
                },
            },
        },
    },
    performance: {
        maxAssetSize: 10 * 1000 * 1000,
        maxEntrypointSize: 1000 * 1000,
    },
    module: {
        rules: [
            // TypeScript/JavaScript
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            [
                                'babel-plugin-styled-components',
                                {
                                    displayName: true,
                                    preprocess: true,
                                },
                            ],
                            ...(isDev ? ['react-refresh/babel'] : []),
                        ],
                    },
                },
            },
            // Workers
            {
                test: /\.worker.ts$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: 'static/worker.[contenthash].js',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                        },
                    },
                ],
            },
            // Images
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process',
        }),
        ...(isAnalyzing
            ? [
                  new BundleAnalyzerPlugin({
                      openAnalyzer: false,
                  }),
              ]
            : []),
        // new webpack.debug.ProfilingPlugin()
    ],
};

export default config;
