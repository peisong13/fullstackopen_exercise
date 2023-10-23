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
module.exports = {
    dummy,
    totalLikes
}