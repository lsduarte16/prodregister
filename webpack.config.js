const path = require('path');

module.exports = {
    mode: 'development', // o 'production' según corresponda
    entry: './src/index.js', // Archivo principal de entrada
    output: {
    path: path.resolve(__dirname, 'dist'), // Directorio de salida
    filename: 'bundle.js', // Nombre del archivo de salida
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
