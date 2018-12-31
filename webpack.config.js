const path = require('path');
module.exports = {
  // entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(css)$/,
        loaders: ["css-loader"]
      },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.tsx|ts?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    port: 8085,
    historyApiFallback: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      src: path.resolve(__dirname, "./src"),
      assets: path.resolve(__dirname, "./src/assets")
    }
  }
};