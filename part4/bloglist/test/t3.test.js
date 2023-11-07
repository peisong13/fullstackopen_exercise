const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const _ = require('lodash')
// const helper = require('./test_helper')

const initialUsers = [{
    username: 'root',
    name: 'psy',
    password: 'rootpwd'
}]

beforeEach(async () => {
    await User.deleteMany({}) // clear the db
    const initUserObjects = initialUsers.map((user) => new User(user))
    const promiseArray = initUserObjects.map((user) => user.save())
    await Promise.all(promiseArray)
}, 100000)

describe('The user database', () => {
    test('there is one user called root', async () => {
        const response = await api.get('/api/users')
        expect(response.status).toEqual(200)
        expect(response.body).toHaveLength(initialUsers.length)
        expect(_.find(response.body, { username: 'root' })).toBeDefined()
    })

    test('needs username and password in POST request and length of them must be 3 chars more', async () => {
        const badUser1 = {
            name: 'name of the user',
            password: 'pwdofuser'
        }
        const response1 = await api.post('/api/users').set('content-type', 'application/json').send(badUser1)
        expect(response1.status).toEqual(400)

        const badUser2 = {
            username: 'myusername',
            name: 'whatevername'
        }
        const response2 = await api.post('/api/users').set('content-type', 'application/json').send(badUser2)
        expect(response2.status).toEqual(400)

        const badUser3 = {
            username: 'my',
            name: 'whatevername',
            password: 'mypassword'
        }
        const response3 = await api.post('/api/users').set('content-type', 'application/json').send(badUser3)
        expect(response3.status).toEqual(400)

        const badUser4 = {
            username: 'myuser',
            name: 'whatevername',
            password: 'pw'
        }
        const response4 = await api.post('/api/users').set('content-type', 'application/json').send(badUser4)
        expect(response4.status).toEqual(400)
    })

    test('username must be unique', async () => {
        const response = await api.post('/api/users').set('content-type', 'application/json').send(initialUsers[0])
        expect(response.status).toEqual(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})