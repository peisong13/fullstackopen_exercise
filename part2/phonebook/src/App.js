import { useState, useEffect } from 'react'
import axios from 'axios'

const PersonNumber = ({person}) => {
  return (
    <p key={person.id}>
      {person.name} {person.number}
    </p>
  )
}

const Filter = ({newNameFilter, handleNewNameFilter}) => (
  <div>filter shown with
  <input value={newNameFilter} onChange={handleNewNameFilter}></input>
  </div>
)

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addName}>
  <h3>add a new</h3>
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
)


const App = () => {
  const [persons, setPersons] = useState([])
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

  // init `persons` using java server data
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newNameFilter={newNameFilter} handleNewNameFilter={handleNewNameFilter}/>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      {persons.filter(person => person.name.toLowerCase().includes(newNameFilter.toLowerCase())).map((person) => <PersonNumber person={person}/>)}
      
    </div>
    
  )
}

export default App
