import { useState, useEffect } from 'react'
import personService from './services/persons'




const PersonNumber = ({person, handleDelete}) => {
  return (
    <p key={person.id}>
      {person.name} {person.number} <button onClick={() => {handleDelete(person)}} key={person.id}>delete</button>
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

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      const changedPersons = [...persons].filter(p => (p.id !== person.id))
      personService
        .deletePerson(person.id)
        .then((_) => {
          setPersons(changedPersons)
        })
    }
  }



  const addName = (event) => {
    event.preventDefault() // prevent default behaviour as required
    let nameObject = {
      name: newName,
      number: newNumber,
      // id: persons[persons.length-1].id + 1
    }

    // if none of the names in `persons` matches `newName`
    // (use `newName` instead of `event.target.value`),
    // add the `nameObject` to `persons`
    if (persons.filter(person => person.name === newName).length === 0) {
      // send the data to the server
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
        })
    } else {
      let alertMessege = `${newName} is already added to phonebook, replace the old number with new one?`
      // alert(alertMessege)
      if (window.confirm(alertMessege)) {
        // replace the old number
        let id = persons.find(person => person.name === newName).id
        personService
          .update(id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id===id ? returnedPerson : person))
            setNewName("")
            setNewNumber("")
          })
      }
    }
    console.log('button clicked', nameObject)
    // console.log(nameObject)
    // console.log(persons)
  }

  // init `persons` using java server data
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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
      {persons.filter(person => person.name.toLowerCase().includes(newNameFilter.toLowerCase())).map((person) => <PersonNumber person={person} handleDelete={handleDelete} key={person.id}/>)}
      
    </div>
    
  )
}

export default App
