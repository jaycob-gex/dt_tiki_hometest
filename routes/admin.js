const express = require('express')
const router = express.Router()
const db = require('../db/mongodb')
const expressJwt = require('express-jwt')
const config = require('config')
const errorHandler = require('../auth/errorHandler')
const authenticate = expressJwt({
  secret : config.get('security.secret')
})

function requiresAdmin() {
    return [
        function(req, res, next) {
            if (req.user && req.user.role === config.get('roles.admin'))
                next();
            else
                res.status(401).send('Not authorized')
            }
    ]
}

/* ADMIN */
router.post('/add', [authenticate, requiresAdmin()], async (req, res) => {
    /*may do some authentication/verification here*/

    const CommandResult = await db.addBook({
        name: req.body.name,
        author: req.body.author,
        url: req.body.url,
        description: req.body.description
    })

    if(CommandResult.result.ok) res.status(200).json(CommandResult.result)
    else res.status(500).json(CommandResult.result)
})

router.put('/update/:bookId', [authenticate, requiresAdmin()], async (req, res) => {
    /*may do some authentication/verification here*/

    const CommandResult = await db.editBook(
        req.params.bookId,
        {
        name: req.body.name,
        author: req.body.author,
        url: req.body.url,
        description: req.body.description
        }
    )

    if(CommandResult.result.ok) res.status(200).json(CommandResult.result)
    else res.status(500).json(CommandResult.result)
})

router.delete('/delete/:bookId', [authenticate, requiresAdmin()], async (req, res) => {
    /*may do some authentication/verification here*/

    const CommandResult = await db.deleteBook(req.params.bookId)

    if(CommandResult.result.ok) res.status(200).json(CommandResult.result)
    else res.status(500).json(CommandResult.result)
})

//error handler
router.use(errorHandler)

module.exports = router;
