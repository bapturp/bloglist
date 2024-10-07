const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) =>
  blogs.length === 0 ? 0 : blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? {}
    : blogs.reduce((acc, val) => (acc.likes >= val.likes ? acc : val), blogs[0])

const mostBlogs = (blogs) => {
  const authorCount = _.countBy(blogs, 'author')

  const authorWithMostBlogs = _.maxBy(
    Object.keys(authorCount),
    (author) => authorCount[author]
  )

  return {
    author: authorWithMostBlogs || '',
    blogs: authorCount[authorWithMostBlogs] || 0,
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')

  const likesPerAuthor = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))

  return _.maxBy(likesPerAuthor, 'likes') || { author: '', likes: 0 }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
