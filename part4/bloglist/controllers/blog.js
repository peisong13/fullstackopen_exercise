require('express-async-errors')
const blogRouter = require('express').Router()
// const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenValidator } = require('../utils/middleware')

// eslint-disable-next-line no-unused-vars
blogRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
// eslint-disable-next-line no-unused-vars
blogRouter.get('/self', async (request, response, next) => {

    const user = await User.findById(request.decodedToken.id)
    // const blogs = await Blog.find({$where: () => {this.user.uername === user.username}}) // MongoServerError: $where not allowed in this atlas tier
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    const blogsOfSelf = blogs.filter((blog) => {blog.user._id.toString() === user.id})
    console.log(blogs[0].user.id.toString())
    console.log(user.id.toString())
    console.log(blogs[5].user.id.toString() === user.id.toString())
    response.json(blogsOfSelf)
}) 
  
// eslint-disable-next-line no-unused-vars
blogRouter.post('/', tokenValidator, async (request, response, next) => { // middleware substack, see https://expressjs.com/en/guide/using-middleware.html
    const body = request.body

    const user = await User.findById(request.decodedToken.id) // find the logged in user name based on decodedToken id

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
blogRouter.delete('/:id', tokenValidator, async (request, response, next) => {

    // compare user with user info in blog
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === request.decodedToken.id) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(403).json({
            error: 'cannot delete blogs that belong to others'
        })
    }
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
