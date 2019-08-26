const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')


const getConfig = (env, argv) => {

    const isDev = argv.mode !== 'production'
    const SRC_PATH = path.resolve(__dirname, 'src')
    const DIST_PATH = path.resolve(__dirname, 'dist')

    const config = {
        entry: ['babel-polyfill', './index.js'],
        mode: isDev ? 'development' : 'production',
        target: 'web',
        devtool: isDev ? 'inline-sourcemap' : 'none',
        context: SRC_PATH,
        devServer: {
            contentBase: DIST_PATH,
            port: 8080
        },
        output: {
            filename: 'main.js',
            path: DIST_PATH
        },
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    options: {
                        runtime: SRC_PATH + '/helpers/handlebars',
                        helperDirs: [SRC_PATH + '/helpers'],
                        inlineRequires: /icons-inline/,
                        precompileOptions: {
                            knownHelpersOnly: false
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['@babel/plugin-proposal-class-properties'],
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev,
                            },
                        },
                        'css-loader?sourceMap',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    include: /(node_modules|bower_components)/,
                    use: [
                        'css-loader?sourceMap',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg|ico)$/i,
                    loader: 'file-loader?name=[path][name].[ext]&context=src',
                    exclude: /icons-inline/
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                    include: /icons-inline/
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(!isDev ? 'production' : 'development')}),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ]
    }

    if(!isDev) config.plugins.push(new CleanWebpackPlugin())

    const files = glob.sync('./src/pages/*.hbs')

    files.forEach(file => {
        const pluginConfig = {
            filename: file.replace('.hbs', '.html').replace('./src/', './'),
            template: file.replace('src/', ''),
            minify: !isDev,
            title: file,
            dev: isDev
        }

        config.plugins.push(new HtmlWebpackPlugin(pluginConfig))
    })

    config.plugins.push(new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.hbs',
        minify: !isDev,
        files: files.map(file => path.basename(file).replace('.hbs', '.html')),
        dev: isDev
    }))

    if(!isDev) {
        config.plugins.push(new CopyWebpackPlugin([
            { from: './assets/static', to: './assets/static' },
            { from: './assets/icons-inline', to: './assets/icons-inline' }
        ]))
    }

    return config

}

module.exports = getConfig
