import blogService from '../services/blogs'

const Blogs = async (user) => {
    const blogs = await blogService.findSelf(user)

    return blogs.map(blog => { <p>{blog.title} {blog.author}</p> })
}

export default Blogs