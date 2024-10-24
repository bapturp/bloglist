#!/bin/sh

baseUrl=http://localhost:8080/api

username='dgreen'
name='David Green'
password='dgr123'

getUsers () {
  curl -s $baseUrl/users
}

getBlogs () {
  curl -s $baseUrl/blogs
}

getBlog () {
  curl -s "${baseUrl}/blogs/${1}"
}

getJWT () {
  curl \
    -s \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"${1}\",\"password\":\"${2}\"}" \
    $baseUrl/login
}

createBlog () {
  # $1 tokenId
  curl \
    -s \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${1}" \
    -d '{"author":"Bob","title":"someblog","url":"http://example.com/blog1"}' \
    $baseUrl/blogs
}


deleteBlog () {
  # $1 blogId
  curl \
    -s \
    -X DELETE \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${token}" \
    "${baseUrl}/blogs/${1}"
}

postUser () {
  # $1 username
  # $2 name
  # $3 password
  curl \
    -s \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"${1}\",\"name\":\"$2\",\"password\":\"${3}\"}" \
    $baseUrl/users
}

case $1 in
  get-users)
    getUsers
    ;;
  get-blogs)
    getBlogs
    ;;
  get-jwt)
    getJWT $username $password
    ;;
  create-blog)
    token=$(getJWT $username $password | jq -r '.token')
    createBlog $token
    ;;
  delete-blog)
    token=$(getJWT $username $password | jq -r '.token')
    blogId=$(createBlog $token | jq -r '.id')
    deleteBlog $blogId
    ;;
  post-user)
    postUser "dgreen" "David Green" "dgr123"
    ;;
  *)
    echo 'Usage request.sh:\n'
    echo '  get-users     List all users'
    echo '  get-blogs     List all blogs'
    echo '  get-jwt       Get a JWT'
    echo '  create-blog   Create a new blog'
    echo '  post-user     Create a new user'
    ;;
esac
