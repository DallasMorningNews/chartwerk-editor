const startServer = require('../server/server.js');
const { argv } = require('yargs');

const port = argv.port || 3000;

module.exports = () => {
  startServer(port);
};
