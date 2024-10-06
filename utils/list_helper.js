const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.length === 0 ? 0 : blogs.reduce((acc, blog) => acc + blog.likes, 0)

module.exports = { dummy, totalLikes }
