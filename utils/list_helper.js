const { countBy, maxBy } = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.length === 0 ? 0 : blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? {}
    : blogs.reduce((acc, val) => (acc.likes >= val.likes ? acc : val), blogs[0])

const mostBlogs2 = (blogs) => {
  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let maxAuthor = ''
  let maxBlogs = 0

  for (const author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authorCount[author]
    }
  }
  return { author: maxAuthor, blogs: maxBlogs }
}

const mostBlogs = (blogs) => {
  const authorCount = countBy(blogs, 'author')

  const authorWithMostBlogs = maxBy(
    Object.keys(authorCount),
    (author) => authorCount[author]
  )

  return {
    author: authorWithMostBlogs || '',
    blogs: authorCount[authorWithMostBlogs] || 0,
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }
