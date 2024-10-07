const { describe, test } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('./blogs')

describe('most likes', () => {
  test('of empty list is empty object', () =>
    assert.deepStrictEqual(mostLikes([]), { author: '', likes: 0 }))

  test('when list has only one blog, equals the blog of that', () =>
    assert.deepStrictEqual(mostLikes([blogs[0]]), {
      author: 'Michael Chan',
      likes: 7,
    }))

  test('of bigger list is returning the author with the most likes', () => {
    assert.deepStrictEqual(mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
