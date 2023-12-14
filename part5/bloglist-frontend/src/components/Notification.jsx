const Notification = ({ messege }) => {
    if (messege === null) {
        return null
    } else {
        return (<div className="error">{messege}</div>)
    }
}

export default Notification