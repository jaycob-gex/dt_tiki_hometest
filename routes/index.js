const express = require('express');
const router = express.Router()
const db = require('../db/mongodb')
const expressJwt = require('express-jwt')
const config = require('config')
const errorHandler = require('../auth/errorHandler')
const authenticate = expressJwt({
  secret : config.get('security.secret')
})

/* USERS */
router.get('/', authenticate, async (req, res) => {
  db.getAllBooks()
    .then(books => {
      res.status(200).json(books)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

//test route in Postman
router.get('/test', authenticate, async (req, res) => {
  res.status(200).json(req.user)
})

//error handler
router.use(errorHandler)

module.exports = router;
