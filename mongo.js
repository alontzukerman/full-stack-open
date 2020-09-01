const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopen:${password}@clustera.2q9bq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    _id: Math.floor(Math.random()*1000000000000),
    name: process.argv[3],
    number: process.argv[4]
  })
  
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name +" "+ person.number)
    })
    mongoose.connection.close()
  })
}