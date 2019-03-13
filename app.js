const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const auth = require('./auth/oauth2')

//Access-Control-Allow-Origin to enable local development
var cors = require('cors')



const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')

const app = express();
app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'jade');

// authentication setup
app.use(passport.initialize())
app.use('/auth', auth.middlewares)

/*route for USERS*/
app.use('/', indexRouter)

/*route for ADMIN, requires users with role 'admin' only*/
app.use('/admin', adminRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500).send(err.message)
  res.render('error')
});

module.exports = app;