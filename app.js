var express = require('express');
//var path = require('path');
var bodyParser = require('body-parser');

var security = require('./security/security.js');
var config = require('./config/config.json');

var mysqlRouter = require('./connection/mysql.js')

var app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//By default, keep-alive is enabled which is not required here
app.use(function(req, res, next){
	res.set('Connection', 'close');
	next();
});

//app.use(security);

app.post('/mybus', mysqlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end('error ' + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end('error ' + err.message);
});


module.exports = app;
