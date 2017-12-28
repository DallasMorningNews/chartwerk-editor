const open = require('open');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfigBuilder = require('./../../webpack-dev.config.js');


const router = express.Router();
router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'));
});

const app = express();
app.use('/', router);
app.set('view engine', 'html');
app.use(express.static('src'));
app.use('/img', express.static('dist/img'));
app.use('/fonts', express.static('dist/fonts'));


module.exports = (port) => {
  const webpackConfig = webpackConfigBuilder(port);
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.listen(port, () => {
    app.keepAliveTimeout = 0;
  });

  middleware.waitUntilValid(() => {
    console.log(`app started on port ${port}`);
    open(`http://localhost:${port}`);
  });
};
