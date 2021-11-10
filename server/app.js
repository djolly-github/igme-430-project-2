const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');

const router = require('./router');

// Step 0: set port and database url depending on environment
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/TaskApp';

// Step 1: connect mongoDB
mongoose.connect(dbURL, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log('Could not connect to database');
    throw err;
  }
});

// Step 2a: declare redis URL and port
let redisURL = {
  hostname: 'redis-15475.c74.us-east-1-4.ec2.cloud.redislabs.com',
  port: 15475,
};

// Step 2b: set redis password based on environment
let redisPass = 'pg1jDmo5sqORb0Qj7dR5UW7NGgVkS0Y1';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPass] = redisURL.auth.split(':');
}

// Step 2c: connect to redis
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPass,
});

// Step 3: init app
const app = express();

// Step 4a: route /hosted for .handlebars html to reference scripts/etc.,
// route favicon, use compression, and use urlencoding
app.use('/hosted', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/assets/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// Step 4b: set session for redis
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Task App Secret Goes Here Oh Wait This Is The Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
// Step 4c: setup handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
// Step 4e: use cookie parser, disable a header for security purposes
app.use(cookieParser());
app.disable('x-powered-by');
// Step 4f: setup Cross-site Request Forgery token usage
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  // eslint-disable-next-line no-console
  console.log('Missing CSRF token');
  return false;
});

// Step 5: setup router
router(app);

// Step 6: listen to requests
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
