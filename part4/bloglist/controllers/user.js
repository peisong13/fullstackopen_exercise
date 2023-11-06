const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    // check if the username is unique
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        console.log('username', username)
        console.log(existingUser)
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save() // save the user into database

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = userRouter