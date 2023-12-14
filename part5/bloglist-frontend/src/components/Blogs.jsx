import blogService from '../services/blogs'
const Blogs = async ({ user }) => {
    const blogs = await blogService.findSelf(user)
    return (<div>
        {blogs.map(blog => {{blog.title} {blog.author}})}
    </div>)
}

export default Blogs