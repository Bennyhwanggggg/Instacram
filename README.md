## Introduction

JavaScript is used increasingly to provide a native-like application experience in the web. One
major avenue of this has been in the use of Single Page Applications or SPAs. SPAs
are generated, rendered, and updated using JavaScript. Because SPAs don't require a user
to navigate away from a page to do anything, they retain a degree of user and application state.

There are millions of websites that utilise SPAs in part of, or all of their web applications.

The web application is a simple SPA which can fetch dynamic data from a HTTP/S API.

## API

The backend server will be where data is retrieved and is located in the backend folder and is written in Python Flask

For the full docs on the API, start the backend server and navigate to the root (very likely to be `localhost:5000`). You'll see
all the endpoints, descriptions and expected responses.

## A Working Product
Site should be compatible with 'modern' Chrome, Safari, and Mozilla browsers.
We will assume your browser has JavaScript enabled, and supports ES6 syntax.

## Getting Started
Please read the relevant docs for setup in the folders `/backend` and `/frontend` of the provided repository.
Each folder outlines basic steps to get started. There are also some comments provided in the frontend source code.

## Features

**Feed Interface**

The application should present a "feed" of user content on the home page derived from the database.  

Each post must include:
1. who the post was made by
2. when it was posted
3. The image itself
4. How many likes it has (or none)
5. The post description text
6. How many comments the post has

**Login**
The site presents a login form and verifies the provided credentials with the backend (`POST /login`). Once logged in, the user can see the home page.

**Registration**
An option to register for "Instacram" is presented allowing the user to sign up to the service. The user information is POSTed to the backend to create the user in the database. (`POST /signup`)

**Feed Interface**
The content shown in the user's feed is sourced from the backend. (`GET /user/feed`)

**Show Likes**
Allow an option for a user to see a list of all users who have liked a post.
Possibly a modal but the design is up to you.

**Show Comments**
Allow an option for a user to see all the comments on a post.
same as above.

**Like user generated content**
A logged in user can like a post on their feed and trigger a api request (`PUT /post/like`)
For now it's ok if the like doesn't show up until the page is refreshed.

**Post new content**
Users can upload and post new content from a modal or seperate page via (`POST /post`)

**Profile**
Users can see their own profile information such as username, number of posts, sum of likes they received on all their posts, etc. You may choose to utilise the information from the api in more creative ways such as displaying their most liked post etc. Get this information from (GET /user)

**Infinite Scroll**
Instead of pagination, users an infinitely scroll through results. For infinite scroll to be
properly implemented you need to progressively load posts as you scroll.

**Comments**
Users can write comments on "posts" via (`POST post/comment`)

**Live Update**
If a user likes a post or comments on a post, the posts likes and comments should
update without requiring a page reload/refresh.

**Update Profile**
Users can update their personal profile via (`PUT /user`) E.g:
* Update email address
* Update password
* Update name

**User Pages**
Let a user click on a user's name/picture from a post and see a page with the users name, and other info.
The user should also see on this page all posts made by that person.
The user should be able to see their own page as well.

**Follow**
Let a user follow/unfollow another user too add/remove their posts to their feed via (`PUT user/follow`)
Add a list of everyone a user follows in their profile page.
Add just the count of followers / follows to everyones public user page

**Delete/Update Post**
Let a user update a post they made or delete it via (`DELETE /post`) or (`PUT /post`)

```
/#profile=me
/#feed
/#profile=janecitizen
```
