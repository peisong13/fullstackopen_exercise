const NewNoteForm = (props) => {
  return (
    <div>
      <h3>create new</h3>
      <p>title: <input type='text' value={props.newTitle} name='newTitle' onChange={({ target }) => props.setNewTitle(target.value)}/></p>
      <p>author: <input type='text' value={props.newAuthor} name='newAuthor' onChange={({ target }) => props.setNewAuthor(target.value)}/></p>
      <p>url: <input type='text' value={props.newUrl} name='newUrl' onChange={({ target }) => props.setNewUrl(target.value)}/></p>
      <button type='submit' onClick={props.handleCreate}>create</button>
    </div>
  )
}

export default NewNoteForm