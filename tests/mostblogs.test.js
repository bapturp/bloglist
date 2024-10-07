const { describe, test } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('./blogs')

describe('most blogs', () => {
  test('of empty list is empty object', () =>
    assert.deepStrictEqual(mostBlogs([]), { author: '', blogs: 0 }))

  test('when list has only one blog, equals the blog of that', () =>
    assert.deepStrictEqual(mostBlogs([blogs[0]]), {
      author: 'Michael Chan',
      blogs: 1,
    }))

  test('of bigger list is returning the most liked blog', () => {
    assert.deepStrictEqual(mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
