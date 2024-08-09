const path = require('path')

module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  },
  components: 'src/atoms/*.js',
  require: [
    path.join(__dirname, 'src/design_token/styles/global.css'),
    path.join(__dirname, 'src/design_token/styles/button.css'),
    path.join(__dirname, 'src/design_token/styles/typography.css'),
    path.join(__dirname, 'src/design_token/styles/container.css'),
    path.join(__dirname, 'src/design_token/styles/table.css'),
    path.join(__dirname, 'src/design_token/styles/modal.css'),
    path.join(__dirname, 'src/design_token/styles/bars.css'),
    'bootstrap/dist/css/bootstrap.min.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'react-toastify/dist/ReactToastify.css'
  ],
}