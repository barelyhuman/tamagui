const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { shouldExclude, TamaguiPlugin } = require('tamagui-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const target = 'web'
const isProduction = NODE_ENV === 'production'

const boolVals = {
  true: true,
  false: false,
}
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const tamaguiOptions = {
  config: './src/tamagui.config.ts',
  components: ['tamagui', '@tamagui/sandbox-ui'],
  importsWhitelist: ['constants.js'],
  disableExtraction,
  // disableExtractFoundComponents: true,
}

/** @type { import('webpack').Configuration } */
module.exports = {
  context: __dirname,
  stats: 'normal', // 'detailed'
  mode: NODE_ENV,
  entry: ['./src/index.web.tsx'],
  devtool: 'source-map',
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  resolve: {
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    alias: {
      'react-native$': 'react-native-web-lite',
      // 'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
      'react-native-reanimated': require.resolve('react-native-reanimated'),
      'react-native-reanimated$': require.resolve('react-native-reanimated'),
      'react-native-svg': '@tamagui/react-native-svg',
    },
  },
  devServer: {
    client: {
      overlay: false,
      logging: 'warn',
    },
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        oneOf: [
          // fix reanimated :/
          // {
          //   test: /.*\.[tj]sx?$/,
          //   use: [
          //     {
          //       loader: 'babel-loader',
          //       options: {
          //         plugins: ['@babel/plugin-transform-flow-strip-types'],
          //         presets: ['@babel/preset-react', '@babel/preset-typescript'],
          //       },
          //     },
          //   ],
          // },

          {
            test: /\.(ts|js)x?$/,
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  target: 'es2020',
                  loader: 'tsx',
                  minify: false,
                },
              },
            ],
          },

          {
            test: /\.css$/,
            use: [MiniCSSExtractPlugin.loader, 'css-loader'],
          },

          {
            test: /\.(png|jpg|gif|woff|woff2)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                },
              },
            ],
            type: 'javascript/auto',
          },
        ],
      },
    ],
  },
  plugins: [
    new TamaguiPlugin(tamaguiOptions),
    // new BundleAnalyzerPlugin(),
    new MiniCSSExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      ignoreOrder: true,
    }),
    isProduction ? null : new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          IS_STATIC: '""',
          NODE_ENV: JSON.stringify(NODE_ENV),
          __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
          TAMAGUI_TARGET: JSON.stringify(target),
          DEBUG: JSON.stringify(process.env.DEBUG || '0'),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: `./index.html`,
    }),
  ].filter(Boolean),
}
