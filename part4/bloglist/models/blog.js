const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

var collection = ''

if (process.env.NODE_ENV === 'test') {
    collection = config.collection_test
} else {
    collection = config.collection
}

const Blog = mongoose.model('Blog', blogSchema, collection)

module.exports = Blog