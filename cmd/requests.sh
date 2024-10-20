#!/bin/sh

baseUrl=http://localhost:8080/api

get_users ()
{
  curl -s $baseUrl/users
}

login ()
{
  curl -s -H 'Content-Type: application/json' -d '{"username":"asmith","password":"asm123"}' $baseUrl/login
}

post_blog ()
{
  token=$(login | jq -r '.token')
  curl \
    -s \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${token}" \
    -d '{"author":"Bob","title":"someblog","url":"http://example.com/blog1"}' \
    $baseUrl/blogs
}

post_user ()
{
  curl \
    -s \
    -H 'Content-Type: application/json' \
    -d '{"username":"dgreen","name":"David Green","password":"s"}' \
    $baseUrl/users
}

case $1 in
  get-users)
    get_users
    ;;
  login)
    login
    ;;
  post-blog)
    post_blog
    ;;
  post-user)
    post_user
    ;;
  *)
    echo 'Usage request.sh:\n'
    echo '  get-users     List all users'
    echo '  login         Get a JWT'
    echo '  post-blog     Create a new blog'
    echo '  post-user     Create a new user'
    ;;
esac
