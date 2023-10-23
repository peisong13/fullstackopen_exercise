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

module.exports = {
    dummy,
    totalLikes,
    favaoriteBlog
}