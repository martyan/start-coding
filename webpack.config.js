const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')

const isDev = process.env.NODE_ENV !== 'production'
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
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        exclude: /icons-inline/,
        loader: 'file-loader?name=[path][name].[ext]&publicPath=http://localhost:8080/&context=src'
      },
      {
        test: /\.svg$/i,
        include: /icons-inline/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}

const files = glob.sync('./src/*.html')
const baseFiles = files.map(file => path.basename(file)).filter(file => file !== 'index.html')

files.forEach(file => {
  const pluginConfig = {
    filename: path.basename(file),
    template: path.basename(file),
    minify: !isDev
  }

  if(path.basename(file) === 'index.html') pluginConfig.files = baseFiles

  config.plugins.push(new HtmlWebpackPlugin(pluginConfig))
})

module.exports = config