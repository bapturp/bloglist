const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { initialsBlogs, blogsInDb, nonExistingId } = require('./test_helpers')

const Blog = require('../models/blog')
const { result } = require('lodash')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(initialsBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialsBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(titles.includes('React patterns'), true)
  })

  test('blogs should have the property id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) =>
      assert.strictEqual(blog.hasOwnProperty('id'), true)
    )
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNoneExistingId = await nonExistingId()

      await api.get(`/api/blogs/${validNoneExistingId}`).expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, initialsBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)

      assert(titles.includes(newBlog.title))
    })

    test('fails if title is not provided', async () => {
      const newBlog = {
        author: 'Bartosz Ciechanowski',
        url: 'https://ciechanow.ski/gps/',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, initialsBlogs.length)
    })

    test('fails if url is not provided', async () => {
      const newBlog = {
        author: 'Bartosz Ciechanowski',
        title: 'GPS',
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, initialsBlogs.length)
    })

    test('blog without the property likes should be created with likes set to 0', async () => {
      const newBlog = {
        title: 'Building and operating a pretty big storage system called S3',
        author: 'Werner Vogels',
        url: 'https://www.allthingsdistributed.com/2023/07/building-and-operating-a-pretty-big-storage-system.html',
      }

      const resultBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body.hasOwnProperty('likes'), true)
      assert.strictEqual(resultBlog.body.likes, 0)
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, initialsBlogs.length - 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
  describe('updating a blog entry', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await blogsInDb()

      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.likes++

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      const resultBlog = blogsAtEnd.filter(
        (b) => b.title === blogToUpdate.title
      )[0]

      assert.deepStrictEqual(resultBlog, blogToUpdate)
    })
  })
})

after(async () => await mongoose.connection.close())
