import { useState } from 'react'
const Blog = ({ blog }) => {
  const [detailVisibility, setDetailVisibility] = useState(false)
  
  const toggleVisibility = () => {
    setDetailVisibility(!detailVisibility)
  }

  const showWhenVisible = { display: detailVisibility? '' : 'none' }
  const detailButtonText = { text: detailVisibility? 'hide': 'view'}

  return (
    <div className='singleBlog'>
      {blog.title} 
      <button onClick={toggleVisibility}>{detailButtonText.text}</button>
      <div className='singleBlogDetail' style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => {}}>like</button></div>
        <div>{blog.author}</div>
      </div>
    </div>  
  )
}
  


export default Blog