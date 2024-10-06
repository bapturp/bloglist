const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.length === 0 ? 0 : blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? {}
    : blogs.reduce((acc, val) => (acc.likes >= val.likes ? acc : val), blogs[0])

module.exports = { dummy, totalLikes, favoriteBlog }
