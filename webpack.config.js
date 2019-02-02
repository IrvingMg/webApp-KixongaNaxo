function getStyleUse(bundleFilename) {
    return [
      {
        loader: 'file-loader',
        options: {
          name: bundleFilename,
        },
      },
      { loader: 'extract-loader' },
      { loader: 'css-loader' },
      {
        loader: 'sass-loader',
        options: {
          includePaths: ['./node_modules'],
        }
      },
    ];
}

module.exports = [
    {
        entry: './resources/styles/aplicacion-web.scss',
        output: {
          // This is necessary for webpack to compile, but we never reference this js file.
          filename: 'style-bundle.js',
        },
        module: {
          rules: [{
            test: /\.scss$/,
            use: getStyleUse('bundle.css')
          }]
        },
    },
    {
        entry: "./resources/scripts/aplicacion-web.js",
        output: {
          filename: "bundle.js"
        },
        module: {
          loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                plugins: ['transform-object-assign']
            }
          }]
        },
    }
];