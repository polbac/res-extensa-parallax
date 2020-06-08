const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: __dirname + '/img/*', to: __dirname + '/dist/', force:true  },
          ],
        }),
      ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    }
};
