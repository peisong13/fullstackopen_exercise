import { useState } from 'react'

const Heading = ({text}) => (<h1>{text}</h1>)

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Statistic = ({text, value}) => (
  <div>
    {text} {value}
  </div>
)

const Statistics = ({good, neutral, bad}) => {

  let all = good + neutral + bad
  let average = (good - bad) / all
  let positive = (good) / (good + neutral + bad)

  if (all > 0) {
    return (
      <div>
        <Statistic text='good' value={good} />
        <Statistic text='neutral' value={neutral} />
        <Statistic text='bad' value={bad} />
        <Statistic text='all' value={all} />
        <Statistic text='average' value={average} />
        <Statistic text='positive' value={positive * 100 + "%"} />
      </div>
    )
    }
  return (
    <div>No feedback given</div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Heading text='give feedback' />
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />

      <Heading text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />


    </div>
  )
}
export default App;
