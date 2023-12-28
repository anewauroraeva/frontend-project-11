// Generated using webpack-cli https://github.com/webpack/webpack-cli

// import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// const isProduction = process.env.NODE_ENV === 'production';

export default {
  mode: process.env.NODE_ENV || 'development',
  // entry: './src/index.js',
  output: {
    // path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
};

/* module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
}; */
