require('dotenv').config()

const PORT = process.env.PORT
const DB_url = process.env.DB_url
const collection = process.env.collection

module.exports = {
    PORT, DB_url, collection
}