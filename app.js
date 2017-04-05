var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var redis = require('connect-redis')(session);

var app = express();
var sessionStore = new redis({
        host: "127.0.0.1",
        port: 6379,
        //db: "session"
    })
// cookie and session
app.use(cookieParser());
session_instance = session({
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: "megachat"
})
app.use(session_instance)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"limit":"10000kb", extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

//Auth
auth = function(req, res, next){
    if(!req.session.user){
        console.log('Not login');
        req.session.error = 'Not login';
        return res.redirect('/login');
    }
    next();
}

notAuth = function(req, res, next){
    if(req.session.user){
        req.session.error = 'login';
        return res.redirect('/chat');
    }
    next();
}

// routes and paths
var index = require('./routes')
var login = require('./routes/login')
var logout = require('./routes/logout')
var chat = require('./routes/chat')
var signup = require('./routes/signup')
var settings = require('./routes/settings')



//Auth
app.all('/', notAuth)
app.all('/login', notAuth)
app.all('signup', notAuth)
app.all('/chat', auth)
app.all('/settings', auth)

//Route
app.use('/', index)
app.use('/signup', signup)
app.use('/login', login)
app.use('/logout', logout)
app.use('/chat', chat)
app.use('/settings', settings)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports.app = app;
module.exports.session = session_instance;
