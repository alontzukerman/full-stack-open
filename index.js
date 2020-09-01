require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))



// exercises 3.7-3.8 ==> morgan
morgan.token('method', (req,res)=>{
  return req.method;
})
morgan.token('path', (req,res)=>{
  return req.path;
})
morgan.token('status', (req,res)=>{
  return res.statusCode;
})
morgan.token('body', (req,res)=>{
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status - :body'))

app.get('/info', (req, res) => { // exercise 3.2
const info = `<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`
  res.send(info)
})
  
app.get('/api/persons', (req, res) => { // exercise 3.1
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => { // exercise 3.3
    const id = request.params.id
    Person.findById(id)
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    }).catch(error=> next(error))
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    //   } else {
    //     response.status(404).end()
    //   }
})

app.delete('/api/persons/:id', (request, response, next) => { // exercise 3.4
    const id = request.params.id
    Person.findByIdAndRemove(id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random()*1000000000000)
}

app.post('/api/persons', (request, response) => { //exercise 3.5
  const body = request.body
  
  if(!body.name || !body.number) // exercise 3.6
    return response.status(400).json({error: 'missing name or number'})

  // if (body.name && body.number){ // exercise 3.6
  //   if(persons.find(person => {   
  //     return (person.name).toLowerCase() === (body.name).toLowerCase()
  //   }))
  //     return response.status(400).json({error: 'name is already exist'})
  // }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));



// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456"
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523"
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345"
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-643122"
//   }
// ]