const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var likes = 0
    if (blogs.length > 0) {
        likes = blogs.reduce((prev, cur) => (prev + cur.likes), 0)
    }
    return likes
}

const favaoriteBlog = (blogs) => {
    var favBlog = {}
    if (blogs.length > 0) {
        favBlog = blogs.reduce((prev, cur) => {
            return cur.likes > prev.likes ? cur : prev
        }, blogs[0])
    }
    // console.log('my favBlog variable is:', favBlog)
    return favBlog
}

const mostBlogs = (blogs) => {
    var authorObject = {
        author: '',
        blogs: 0
    }

    if (blogs.length > 0) {
        const blogCount = _.countBy(blogs, 'author')
        console.log(blogCount)
        _.forEach(blogCount, (num, name) => {
            if (num > authorObject.blogs) {
                authorObject.author = name
                authorObject.blogs = num
            }
        })
    }
    return authorObject
}

module.exports = {
    dummy,
    totalLikes,
    favaoriteBlog,
    mostBlogs
}