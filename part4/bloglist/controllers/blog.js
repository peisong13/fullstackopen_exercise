require('express-async-errors')
const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// eslint-disable-next-line no-unused-vars
blogRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
// eslint-disable-next-line no-unused-vars
blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    const token = request.token // with is set by middleware tokenExtractor
    if (!token) {
        return response.status(401).json({
            error: 'token missing'
        })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    
    if (!decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if (!blog['title'] || !blog['url']) {
        response.status(400).json({ error: 'content missing' })
        return
    }

    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

})

// eslint-disable-next-line no-unused-vars
blogRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

// eslint-disable-next-line no-unused-vars
blogRouter.put('/:id', (request, response, next) => {
    const body = request.body
    
    const blog = {
        // title: body.title,
        // author: body.author,
        likes: body.likes,
        // url: body.url
    }
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
        .then((updatedBlog) => {
            response.json(updatedBlog)
        })
})

module.exports = blogRouter
