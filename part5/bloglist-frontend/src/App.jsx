import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewNoteForm from './components/NewNoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessege, setErrorMessege] = useState(null)
  const [infoMessege, setInfoMessege] = useState(null)
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedBlogUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogUserJSON) {
      const user = JSON.parse(loggedBlogUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      updateBlogs()
    }
  }, [])

  const updateBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )}

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      updateBlogs()
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      console.log('login sucessful')
      console.log(user.username)
    } catch (exception) {
      setErrorMessege('Wrong username or password.')
      setTimeout(() => {
        setErrorMessege(null)
      }, 5000)
    }
  }
  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const response = await blogService.create({ newTitle, newAuthor, newUrl })
      updateBlogs()
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      blogFormRef.current.toggleVisibility()
      setInfoMessege('You added a post.')
      setTimeout(() => {
        setInfoMessege(null)
      }, 5000)
    } catch (exception) {
      setErrorMessege('Something went wrong.')
      setTimeout(() => {
        setErrorMessege(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input type='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  )
  const logOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    window.location.reload()
  }

  const userBlogs = () => (
    <div>
      <p className='loggedInfo'>user {user.name} logged in. <button onClick={logOut}>log out</button></p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewNoteForm newTitle={newTitle} setNewTitle={setNewTitle} newAuthor={newAuthor} setNewAuthor={setNewAuthor} newUrl={newUrl} setNewUrl={setNewUrl} handleCreate={handleCreate} />
      </Togglable>
      {blogs.sort((a, b) => (b.likes - a.likes)).map(blog => (
        <Blog blog={blog} key={blog.id}/>
      )
      )}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification messege={errorMessege} level='error'/>
      <Notification messege={infoMessege} level='info'/>
      {!user && loginForm()}
      {user && userBlogs()}
    </div>
  )
}

export default App