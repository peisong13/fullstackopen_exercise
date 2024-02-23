import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [detailVisibility, setDetailVisibility] = useState(false)
  
  const toggleVisibility = () => {
    setDetailVisibility(!detailVisibility)
    // console.log(blog)
  }

  const showWhenVisible = { display: detailVisibility? '' : 'none' }
  const detailButtonText = { text: detailVisibility? 'hide': 'view' }

  const handleLike = async () => {
    try {
      const response = await blogService.like({id: blog.id, data:{likes: blog.likes + 1}})
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div className='singleBlog'>
      {blog.title} 
      <button onClick={toggleVisibility}>{detailButtonText.text}</button>
      <div className='singleBlogDetail' style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.author}</div>
      </div>
    </div>  
  )
}
  


export default Blog