const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})
  
blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    if (!blog['title'] || !blog['url']) {
        response.status(400).json({ error: 'content missing' })
        return
    }

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
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
