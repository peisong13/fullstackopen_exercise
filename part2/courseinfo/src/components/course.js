const CourseArray = ({ courses }) => {
    return (courses.map((course) => < Course course={course} key={course.id}/>))
  }
  
  const Course = ({ course }) => {
    let courseInfo = course.parts.map((part) => <p key={part.id}>{part.name} {part.exercises}</p>)
    let total = course.parts.reduce((sum, part) => (sum + part.exercises), 0)
    return (
      <div>
        <h1>{course.name}</h1>
        {courseInfo}
        <b>total of {total} exercises</b>
      </div>
    )
  }

  export default CourseArray;