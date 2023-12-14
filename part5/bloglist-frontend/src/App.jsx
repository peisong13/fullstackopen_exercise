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

  const updateBlogs = (user) => {
    blogService.findSelf(user).then(blogs =>
      setBlogs( blogs )
  )}
  

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      updateBlogs(user)
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

  const userBlogs = () => (
    <div>
        <p className='loggedInfo'>user {user.name} logged in</p>
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