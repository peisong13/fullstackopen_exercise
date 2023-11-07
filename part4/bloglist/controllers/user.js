const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({
            error: 'username and password must be provided'
        })
    }
    // check if the username is unique
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        // console.log('username', username)
        // console.log(existingUser)
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    if (password.length < 3 || username.length < 3) {
        return response.status(400).json({
            error: 'length of username and password must be greater than 3 characters'
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
    // populate user with blog, turn off strictPopulate, select url
    const users = await User.find({}).populate({path: 'blogs', select: { url: 1, title: 1, author: 1 }})
    response.json(users)
})

module.exports = userRouter