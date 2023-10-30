const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const _ = require('lodash')
const helper = require('./test_helper')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }  
]

const oneBlog = {
    title: 'My lovely blog',
    author: 'psyang',
    url: 'http://www.google.com',
    likes: 1
}

const oneBlogWithoutLike = {
    title: 'My poor blog, nobody likes it. Even the POST request',
    author: 'psyang',
    url: 'http://www.google.com'
}

const oneBlogWithoutTitle = {
    author: 'psyang',
    url: 'http://www.google.com',
    likes: 1
}

const oneBlogWithoutUrl = {
    title: 'My lovely blog. Well...Not lovely anymore.',
    author: 'psyang',
    likes: 1
}

beforeEach(async () => {
    await Blog.deleteMany({}) // clear the test database
    const blogObjects = initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
}, 100000)

describe('On the server', () => {
    test('blogs are returned as json and the number is correct', async () => {
        const response = await api.get('/api/blogs')
        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toMatch(/application\/json/)
        expect(response.body).toHaveLength(initialBlogs.length)
    }, 100000)
    
    test('the unique identifier is named id', async () => {
        const response = await api.get('/api/blogs')
        // console.log(response.body)
        response.body.forEach((blog) => {
            expect(blog['id']).toBeDefined()
        })
    })
    
    test('POST method is handled right', async () => {
        const response = await api.post('/api/blogs').set('content-type', 'application/json').send(oneBlog)
        expect(response.status).toEqual(201)
        _.forEach(oneBlog, (v, k) => {
            expect(response.body[k]).toEqual(v)
        })
    
        const getResponse = await api.get('/api/blogs')
        expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
    })
    
    test('if there is no likes property in POST request, set it to zero', async () => {
        const response = await api.post('/api/blogs').set('content-type', 'application/json').send(oneBlogWithoutLike)
        expect(response.body['likes']).toEqual(0)
    })
    
    test('if there is no title or url in POST request, return 400 Bad Request', async () => {
        var response = await api.post('/api/blogs').set('content-type', 'application/json').send(oneBlogWithoutTitle)
        expect(response.status).toEqual(400)
        
        response = await api.post('/api/blogs').set('content-type', 'application/json').send(oneBlogWithoutUrl)
        expect(response.status).toEqual(400)
    }, 10000)
})

describe('Regarding Deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogAtStart = await helper.blogsInDb()

        const blogToDelete = blogAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogAtEnd = await helper.blogsInDb()
        expect(blogAtEnd).toHaveLength(initialBlogs.length - 1)

        const ids = blogAtEnd.map(r => r.id)
        expect(ids).not.toContain(blogToDelete.id)

    })
})


afterAll(() => {
    mongoose.connection.close()
})