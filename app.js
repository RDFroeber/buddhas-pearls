/**
 * Buddhas & Pearls
 **/

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    lusca = require('lusca'),
    dustjs = require('adaro'),
    multer = require('multer');

var app = express();

/**
 * Configuration
 **/

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(multer({ inMemory: true}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * View Engine
 **/

dustjs.helper = require('dustjs-helpers');
app.engine('dust', dustjs.dust({ cache: false }));
app.engine('js', dustjs.js({ cache: false }));
app.set('views', __dirname + '/public/templates');
app.set('view engine', 'dust');
app.set('view cache', false);

/**
 * Session Management
 */

app.use(session({
  secret: 'divorante',
  resave: true,
  saveUninitialized: true
}));

/**
 * Lusca Security 
 **/

app.use(lusca({
  csrf: true,
  csp: { /* ... */},
  xframe: 'SAMEORIGIN',
  p3p: 'ABCDEF',
  hsts: {maxAge: 31536000, includeSubDomains: true},
  xssProtection: true
}));

/**
 * Passport
 **/

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Routes
 **/

app.use('/', require('./routes'));
app.use('/', require('./routes/login'));
app.use('/account', require('./routes/users'));
app.use('/store', require('./routes/items'));
app.use('/admin', require('./routes/admin'));
app.use('/inventory', require('./routes/inventory'));
app.use('/inventory', require('./routes/categories'));

app.use('/mail', require('./routes/mail'));

/**
 * Error Handling
 **/

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler with stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    status = err.status || 500;
    res.status(status);
    console.log(err)
    res.render('errors/' + status, {
      url: req.url,
      message: err.message,
      error: err
    });
  });
}

// production error handler without stacktrace
app.use(function(err, req, res, next) {
  status = err.status || 500;
  res.status(status);
  res.render('errors/' + status, {
    url: req.url,
    message: err.message,
    error: {}
  });
});

/**
 * MongoDB Connection
 **/

var mongoose = require('mongoose'),
    db = mongoose.connection,
    dbURI = 'mongodb://admin:divorante@dogen.mongohq.com:10032/buddha';

mongoose.connect(dbURI);

// When successfully connected
db.on('connected', function () {
  console.log('Mongoose connection open at ' + dbURI + '\n');
});

module.exports = app;
