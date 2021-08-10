var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

const indexRouter = require('./routes/index');
const clientesRouter = require('./routes/clientes');
const helpdeskRouter = require('./routes/helpdesk');  
const gestionRouter = require('./routes/gestion');
const areaRouter = require('./routes/area');
const calidadRouter = require('./routes/calidad');
const esCliente = require("./controladores/index").esCliente;
const esEmpleadoHD = require("./controladores/index").esEmpleadoHD;
const esEmpleado = require("./controladores/index").esEmpleado;
const esAdmin = require("./controladores/index").esAdmin;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  sameSite:"none",
  secure:true,
  cookie:{
    maxAge: 24 * 60 * 60 * 365 * 1000
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cliente',esCliente, clientesRouter);
app.use('/helpdesk',esEmpleadoHD, helpdeskRouter);
app.use('/gestion',esAdmin, gestionRouter);
app.use('/area',esEmpleado, areaRouter);
app.use('/calidad',esEmpleado, calidadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
