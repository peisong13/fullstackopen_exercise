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

const Notification = ({ messege, level }) => {
  if (messege === null) {
    return null
  }

  return (
    <div className={level}>{messege}</div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newNameFilter, setNewNameFilter] = useState('')
  const [notificationMessege, setNotificationMessege] = useState(null)
  const [notificationLevel, setNotificationLevel] = useState('info')

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
          setNotificationLevel("info")
          setNotificationMessege(
            `Delete ${person.name}`
          )
          setTimeout(() => {setNotificationMessege(null)}, 5000)
        })
        .catch(error => {
          setNotificationLevel('error')
          setNotificationMessege(
            `Failed to delete of ${person.name}`
          )
          setTimeout(() => {setNotificationMessege(null)}, 5000)
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
          // console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          setNotificationLevel("info")
          setNotificationMessege(
            `Add ${returnedPerson.name}`
          )
          setTimeout(() => {setNotificationMessege(null)}, 5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setNotificationLevel('error')
          setNotificationMessege(
            `${error.response.data.error}` 
            // I thint the server should do something to prevent adding same person by different users simultaneously add throw error to user
            // only local `person` is checked when adding person
          )
          setTimeout(() => {setNotificationMessege(null)}, 5000)
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
            setNotificationLevel("info")
            setNotificationMessege(
              `Change number of ${returnedPerson.name} to ${returnedPerson.number}`
            )
            setTimeout(() => {setNotificationMessege(null)}, 5000)

          })
          .catch(error => {
            setNotificationLevel('error')
            setNotificationMessege(
              `${error.response.data.error}`
            )
            setTimeout(() => {setNotificationMessege(null)}, 5000)
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
      <Notification messege={notificationMessege} level={notificationLevel} />
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
