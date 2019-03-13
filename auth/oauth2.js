const passport = require('passport')
const Strategy = require('passport-local')
const jwt = require('jsonwebtoken')
const db = require('../db/mongodb')
const config = require('config')


//perform checks against database with username & password
passport.use(new Strategy(  
  async function(username, password, done) {
    try{
      const user = await db.findUser(username, password)
      done(null, user)
    }
    catch(error) {
      console.error('db.findUser: ', error)
      done(null, false, {message: error.message})
    }
  }
))

//serializing into req.user without session
function serialize(req, res, next) {
  req.user = {
    id: req.user._id,
    username: req.user.username,
    role: req.user.role
  }

  next()
}

function generateToken(req, res, next) {
  //sign the token with id/username/role info embedded
  req.token = jwt.sign(
    {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
    , config.get('security.secret') , 
    {
      expiresIn: parseInt(config.get('security.tokenExpiresInMinutes')) * 60
    }
  )

  next()
}

function respond(req, res) {  
  res.status(200).json({
    user: req.user,
    token: req.token
  })
}

exports.middlewares = [
    passport.authenticate(  
        'local', 
        {
          session: false,
          failWithError: true
        }
    ), 
    serialize, 
    generateToken, 
    respond
];