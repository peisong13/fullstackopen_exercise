const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://poziy6:${password}@cluster0.gjajh1l.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    // console.log(process.argv.length)
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(returnedPerson => {
        console.log(`Add ${returnedPerson.name} ${returnedPerson.number}`)
        // console.log(result)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
