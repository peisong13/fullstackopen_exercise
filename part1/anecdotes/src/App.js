import { useState } from 'react'

const Button = ({onClick, text}) => (<button onClick={onClick}>{text}</button>)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const [points, setPoints] = useState(new Array(10).fill(0))
  const points_copy = [...points]

  const [mostVoted, setMostVoted] = useState(0)
  const [selected, setSelected] = useState(0)

  let randomSelect = () => {
    let randomSelected = Math.floor(Math.random() * (anecdotes.length))
    console.log(randomSelected)
    console.log(points)
    return randomSelected
  }
  // console.log(parseInt(Math.random()*anecdotes.length,10)+1)

  let handleVote = (selected) => {

    points_copy[selected] += 1
    
    setPoints(points_copy)
    setMostVoted(points_copy.indexOf(Math.max(...points_copy)))
  }
  

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {points[selected]} votes.</p>
      <p>
        <Button onClick={() => {handleVote(selected)}} text='vote' />
        <Button onClick={() => {setSelected(randomSelect())}} text="next anecdote" />
      </p>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
      <p>has {points[mostVoted]} votes.</p>
    </div>
  )
}

export default App

