const { describe, test } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const blogs = require('./blogs')

describe('favorite blog', () => {
  test('of empty list is empty object', () =>
    assert.deepStrictEqual(favoriteBlog([]), {}))

  test('when list has only one blog, equals the blog of that', () =>
    assert.deepStrictEqual(favoriteBlog([blogs[0]]), blogs[0]))

  test('of bigger list is returning the most liked blog', () =>
    assert.strictEqual(favoriteBlog(blogs), blogs[2]))
})
