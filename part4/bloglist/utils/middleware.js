const logger = require('./logger')
const jwt = require('jsonwebtoken')

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

const userExtractor = (request, response, next) => {
    // user id is extracted in request.decodedToken.id
    // use after tokenExtractor
    // should not return error
    const token = request.token
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (decodedToken.id) {
            request.decodedToken = decodedToken
        } else {
            request.decodedToken = null
        }
    } else {
        request.decodedToken = null
    }
    next()
}

const tokenValidator = (request, response, next) => {
    const token = request.token // with is set by middleware tokenExtractor
    if (!token) {
        return response.status(401).json({
            error: 'token missing'
        })
    }

    if (!request.decodedToken.id) { // if the request.decodedToken is not extracted by userExtractor, try it
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (decodedToken.id) {
            request.decodedToken = decodedToken
        } else {
            return response.status(401).json({
                error: 'token missing or invalid'
            })
        }
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
    userExtractor,
    tokenValidator,
    unknowEndpoint,
    errorHandler
}