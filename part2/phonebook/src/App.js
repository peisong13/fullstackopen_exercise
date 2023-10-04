import { useState } from 'react'
const PersonNumber = ({name, number}) => {
  return (
    <p key={name}>
      {name} {number}
    </p>
  )
}
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number : '040-1234567' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
      setNewName(event.target.value) 
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault() // prevent default behaviour as required
    let nameObject = {
      name: newName,
      number: newNumber
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
      <form onSubmit={addName}>
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
      {persons.map((person) => <PersonNumber name={person.name} number={person.number}/>)}
      <div>debug: {newName}</div>
    </div>
    
  )
}

export default App
