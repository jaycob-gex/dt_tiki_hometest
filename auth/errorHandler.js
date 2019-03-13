//must have 4 parameters to let express know this is an error handler
module.exports = function(err, req, res, next) { // eslint-disable-line
    if(err.name === 'UnauthorizedError') {
        res.status(err.status).json(err)
        return
    }
}