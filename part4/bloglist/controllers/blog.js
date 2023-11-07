const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne()

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

blogRouter.delete('/:id', (request, response) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

blogRouter.put('/:id', (request, response) => {
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
