const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@server': path.resolve(__dirname, 'src/server'),
      '@firebase': path.resolve(__dirname, 'src/firebase'),
      '@tools': path.resolve(__dirname, 'src/tools'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  externals: {
    // Firebase Admin SDK는 external로 처리
    'firebase-admin': 'commonjs firebase-admin',
  },
};