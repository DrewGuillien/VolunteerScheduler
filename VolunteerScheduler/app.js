var express = require('express');
var mongoose = require('mongoose');

var path = require('path');
// Uncomment when we get an actual favicon
// var favicon = require('serve-favicon'); 
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

// Attempt to make Mongo Connection
connect()
    .on('error', console.log)
    .on('disconneted', connect);

function connect() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect('mongodb://localhost:27017/VolunteerDb', options).connection;
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.send(err.status || 500, { msg: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.send(err.status || 500, { msg: err });
});


module.exports = app;
