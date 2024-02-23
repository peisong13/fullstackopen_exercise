const Notification = ({ messege, level }) => {
  if (messege === null) {
    return null
  } else {
    return (<div className={level}>{messege}</div>)
  }
}

export default Notification