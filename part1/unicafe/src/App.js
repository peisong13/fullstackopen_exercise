import { useState } from 'react'

const Heading = ({text}) => (<h1>{text}</h1>)

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {

  let all = good + neutral + bad
  let average = (good - bad) / all
  let positive = (good) / (good + neutral + bad)

  if (all > 0) {
    return (
      <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={all} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positive * 100 + "%"} />
          </tbody>
        </table>
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
