import { useState } from 'react'
const PersonNumber = ({person}) => {
  return (
    <p key={person.id}>
      {person.name} {person.number}
    </p>
  )
}
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newNameFilter, setNewNameFilter] = useState('')

  const handleNameChange = (event) => {
      setNewName(event.target.value) 
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewNameFilter = (event) => {
    setNewNameFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault() // prevent default behaviour as required
    let nameObject = {
      name: newName,
      number: newNumber,
      id: persons[persons.length-1].id + 1
    }

    // if none of the names in `persons` matches `newName`
    // (use `newName` instead of `event.target.value`),
    // add the `nameObject` to `persons`
    if (persons.filter(person => person.name === newName).length === 0) {
      setPersons(persons.concat(nameObject))
    } else {
      let alertMessege = `${newName} is already added to phonebook`
      alert(alertMessege)
    }
    console.log('button clicked', nameObject)
    // console.log(nameObject)
    // console.log(persons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with
        <input value={newNameFilter} onChange={handleNewNameFilter}></input>
      </div>
      <form onSubmit={addName}>
        <h1>add a new</h1>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(person => person.name.toLowerCase().includes(newNameFilter)).map((person) => <PersonNumber person={person}/>)}
      <div>debug: {newName}</div>
    </div>
    
  )
}

export default App
