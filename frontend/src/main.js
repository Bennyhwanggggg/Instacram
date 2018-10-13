// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

// we can use this single api request multiple times
// const feed = api.makeAPIRequest('user/feed');

const feed = api.getFeeds();

feed.then(posts => {console.log(posts)});

feed
.then(posts => {
    posts.reduce((parent, post) => {

        parent.appendChild(createPostTile(post));
        
        return parent;

    }, document.getElementById('large-feed'))
});

// Potential example to upload an image
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', uploadImage);

const user = document.getElementById('curr_user');
var curr_user = getCurrentUser();
var feeds = document.getElementById('large-feed');
if (curr_user != null) {
	user.innerHTML = curr_user;
	feeds.innerHTML = "Not Yet Implemented";
} else {
	user.innerHTML = "Login";
}


function getCurrentUser(){
	if (window.localStorage)
        return window.localStorage.getItem('logged_in');
    else
        return null
}