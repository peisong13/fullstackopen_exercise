const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path)
    logger.info('Body: ', req.body)
    logger.info('---')
    next()
}

const tokenExtrator = (request, response, next) => {
    const auth = request.get('authorization')
    // console.log(auth)
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        request.token = auth.substring(7)
    } else {
        // console.log('set token to null')
        request.token = null
    }
    next()
}

const unknowEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {

        return response.status(401).json({
            error: 'invalid token'
        })
  
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
  
    next(error)
}

module.exports = {
    requestLogger,
    tokenExtrator,
    unknowEndpoint,
    errorHandler
}