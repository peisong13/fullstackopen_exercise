const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const { unknowEndpoint, errorHandler, requestLogger } = require('./utils/middleware')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')


const mongoUrl = config.DB_url
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('MongoDB connected.')
    })
    .catch(() => {
        logger.error('MongoDB connection failed.')
    })

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(unknowEndpoint)
app.use(errorHandler)

module.exports = app