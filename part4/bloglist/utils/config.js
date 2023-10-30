require('dotenv').config()

const PORT = process.env.PORT
const DB_url = process.env.DB_url
const collection = process.env.collection
const collection_test = process.env.collection_test

module.exports = {
    PORT, DB_url, collection, collection_test
}