const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongodb = require('./mongodb');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

//save the raw body incase we need to use it for hash verifications
app.use(express.json({
  limit: 10485760, extended: true,
  verify: (req, res, buf) => {
    req.headers.rawBody = buf.toString();
  }
}));

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors({ origin: true }));
app.use(compress());

app.use(express.json({limit: 10485760}));
app.use(express.urlencoded({limit: 10485760, extended: true, parameterLimit:50000}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio({
  origins: process.env.SOCKETIO_ORIGINS || '*:*',
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With,x-mode,x-client,x-clientid',
      'Access-Control-Allow-Credentials': true
    });
    res.end();
  }
}, function(io) {
  io.sockets.setMaxListeners(555);
  io.use(function (socket, next) {
    socket.feathers.socketId = socket.id;
    next();
  });
}));

app.configure(mongodb);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

//load extend auth system
app.configure(require('feathers-auth-extend'));

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({
  logger,
  json: (err,req,res) => {
    err = err.toJSON();
    const errors = {
      code: err.code,
    };
    if (err.className !== 'method-not-allowed') {
      errors.message = err.message;
    }
    res.status(errors.code).json({errors});
    res.json(err);
  }
}));


let { Queue, Worker, QueueScheduler }  = require('bullmq');

app.hooks(appHooks);

module.exports = app;

process.on('unhandledRejection', (error, p) => {
  console.log('=== UNHANDLED REJECTION ===');
  console.dir(error.stack);
});
