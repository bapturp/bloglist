const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const { initialsBlogs, blogsInDb } = require('./test_helpers')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (blog of initialsBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns 6 blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 6)
  })

  test('the first blog is about React Patterns', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(titles.includes('React patterns'), true)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Building and operating a pretty big storage system called S3',
      author: 'Werner Vogels',
      url: 'https://www.allthingsdistributed.com/2023/07/building-and-operating-a-pretty-big-storage-system.html',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await blogsInDb()

    assert.strictEqual(blogAtEnd.length, initialsBlogs.length + 1)

    const titles = blogAtEnd.map((blog) => blog.title)

    assert(titles.includes(newBlog.title))
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'bob',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogAtEnd = await blogsInDb()

    assert.strictEqual(blogAtEnd.length, initialsBlogs.length)
  })

  test('a specific blog can viewed', async () => {
    const blogsAtStart = await blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('blogs should have a property named `id`', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) =>
      assert.strictEqual(blog.hasOwnProperty('id'), true)
    )
  })
})

after(async () => await mongoose.connection.close())
