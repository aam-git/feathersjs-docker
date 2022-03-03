/* eslint-disable no-console */

//build configuration from environment vars
const fs = require('fs');

if (process.env?.DEFAULT_CONFIG) fs.writeFileSync('/usr/src/app/config/default.json', process.env.DEFAULT_CONFIG);

if (process.env?.PRODUCTION_CONFIG) fs.writeFileSync('/usr/src/app/config/production.json', process.env.PRODUCTION_CONFIG);
//end configuration builder

const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
