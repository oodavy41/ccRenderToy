var path = require("path");

module.exports = {

    entry: './src/entry.ts',

    output: {
        filename: 'app.js',
        path: path.resolve('./dist'),
    },

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/, loader: 'ts-loader' ,
                test: /\.js$/, loader: 'js-loader'
            }
        ]
    }

}