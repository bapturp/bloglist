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

case $1 in
  get-users)
    get_users
    ;;
  login)
    login
    ;;
  post_blog)
    post_blog
    ;;
  *)
    echo 'Usage request.sh:\n'
    echo '  get-users     List all users'
    echo '  login         Get a JWT'
    echo '  post-blog     Post a blog'
    ;;
esac
