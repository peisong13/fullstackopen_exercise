import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessege, setErrorMessege] = useState(null)
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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
    blogService.findSelf().then(blogs =>
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
        <h3>create new</h3>
        <p>title: <input type='text' value={newTitle} name='newTitle' onChange={({ target }) => setNewTitle(target.value)}/></p>
        <p>author: <input type='text' value={newAuthor} name='newAuthor' onChange={({ target }) => setNewAuthor(target.value)}/></p>
        <p>url: <input type='text' value={newUrl} name='newUrl' onChange={({ target }) => setNewUrl(target.value)}/></p>
        <button type='submit' onClick={handleCreate}>create</button>
        {blogs.map(blog => (<Blog blog={blog} key={blog.id}/>))}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification messege={errorMessege}/>
      {!user && loginForm()}
      {user && userBlogs()}
    </div>
  )
}

export default App