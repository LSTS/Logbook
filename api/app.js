var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.io = require('socket.io')();

var indexRouter = require('./routes/index')(app.io);
var testAPIRouter = require('./routes/testAPI');
var fileRouter = require('./routes/file');
var createFileRouter = require('./routes/createFile');
var editFileRouter = require('./routes/editFile');
var updateFileRouter = require('./routes/updateFile');
var downloadFile = require('./routes/downloadFile');
var uploadImageRouter = require('./routes/uploadImage');
var getImageRouter = require('./routes/getImage');


var cors = require('cors');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter);
app.use('/file', fileRouter);
app.use('/createFile', createFileRouter);
app.use('/editFile', editFileRouter);
app.use('/updateFile', updateFileRouter);
app.use('/download', downloadFile);
app.use('/uploadImage' , uploadImageRouter);
app.use('/image' , getImageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
