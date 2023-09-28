const Header = (props) => {
  console.log(props)

  return (
      <h1>{props.course.name}</h1>
    )
  }
const Content = (props) => {
  let contents = props.course.parts.map(value => <Part part={value}/>)
  console.log(contents)
  return contents
}

const Part = (props) => (
  <p>{props.part.name} {props.part.exercises}</p>
)

const Total = (props) => {
  let num_of_exercises = 0

  props.course.parts.forEach(value => {
    num_of_exercises += value.exercises
  })
  
  return (
    <p>Number of exercises {num_of_exercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App;
