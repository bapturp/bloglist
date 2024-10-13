const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const readline = require('node:readline')

const initialsBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: 'asmith',
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: 'bbrown',
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: 'bbrown',
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: 'cjones',
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: 'cjones',
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: 'cjones',
  },
]

const initalUsers = [
  {
    username: 'asmith',
    name: 'Alice Smith',
    passwordHash:
      '$2b$10$MVRZ48ieo.JUMxXDaUydd.bR41d17W8L2USIe6CgUycTJ8trHdU8q',
  },
  {
    username: 'bbrown',
    name: 'Bob Brown',
    passwordHash:
      '$2b$10$KvQHk92PPXkjJlF.sOW8fenYcfJhW50ylHLMoNzbjWObqiyEYeDyS',
  },
  {
    username: 'cjones',
    name: 'Charlie Jones',
    passwordHash:
      '$2b$10$wRuB0pWK9EfVrokB0ANzT.Nv72StthXcdd0aQVjSWvrlXBx8dCoQS',
  },
]

mongoose.set('strictQuery', false)

const seedDb = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)

    await User.deleteMany({})
    await Blog.deleteMany({})

    for (const user of initalUsers) {
      const userObject = new User(user)
      await userObject.save()
    }

    for (const blog of initialsBlogs) {
      const user = await User.findOne({ username: blog.user })
      blog.user = user.id

      const blogObject = new Blog(blog)
      await blogObject.save()

      user.blogs = user.blogs.concat(blogObject.id)

      await user.save()
    }
  } catch (error) {
    console.log(error)
  } finally {
    await mongoose.connection.close()
  }
  return
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(
  'This operation is destructive, do you wan to seed the database? <yes><no>\n',
  (answer) => {
    if (answer === 'yes' || answer === 'y') {
      seedDb()
    }
    rl.close()
  }
)
