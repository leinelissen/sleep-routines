const path = require('path');

module.exports = {
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    mode: "development",
    entry: "./src/web/index.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'public/dist/'),
    },
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/dist/',
        host: '0.0.0.0',
    }
}