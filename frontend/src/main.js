// importing named exports we use brackets
import { createPostTile, uploadImage, clearModalContent, createElement, getUserNames } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

const API_URL = 'http://localhost:5000';

// we can use this single api request multiple times
// const feed = api.makeAPIRequest('user/feed');

const feed = api.getFeeds();

feed
.then(posts => {
    posts['posts'].reduce((parent, post) => {

        parent.appendChild(createPostTile(post));
        
        return parent;

    }, document.getElementById('large-feed'))
});

// Upload button;
const upload = document.getElementById('uploadButton');
if (upload) {
	upload.addEventListener('click', uploadImage);
}

const update = document.getElementById('updateButtonSubmit');
if (update) {
	update.addEventListener('click', function() {
		var newEmail = document.getElementById('email').value;
		var newPassword = document.getElementById('password').value;
		var newName = document.getElementById('name').value;
		var token = window.localStorage.getItem('token');
		if (!newEmail && !newPassword && !newName) {
			document.getElementById('status').innerHTML = 'At least one field must be filled in';
		} else {
			var query = {};
			if (newEmail) {
				query['email'] = newEmail;
			}
			if (newPassword) {
				query['password'] = newPassword;
			}
			if (newName) {
				query['name'] = newName;
			}
			fetch(`${API_URL}/user`, {
				method: 'PUT',
				headers: {
      		'Content-Type': 'application/json',
        	'Authorization' : `Token ${token}`
        },
        body: JSON.stringify(query)
			}).then(function(res) {
				if (res.status == 200) {
					document.getElementById('status').innerHTML = 'Success!';
				} else {
					document.getElementById('status').innerHTML = 'Error has occured while updating!';
				}
			})
		} 
	})
}


const user = document.getElementById('curr_user');
var curr_user = getCurrentUser();
var feeds = document.getElementById('large-feed');
if (curr_user != null) {
	user.innerHTML = curr_user;
	user.href="#modalWindow";
	document.getElementById('logoutButton').innerHTML = 'Logout';
	document.getElementById('registerButton').style.display = 'none';

	user.addEventListener('click', function() {
		clearModalContent();
		var modalContent = document.getElementById('modalContent');
		var token = window.localStorage.getItem('token');
		fetch(`${API_URL}/user`, {
			method: 'GET',
      headers: {
      	'Content-Type': 'application/json',
        'Authorization' : `Token ${token}`
        }
		}).then(function(res) {
			res.json().then(function(data) {
				modalContent.appendChild(createElement('h3', data.name, {id: 'profile_name'}));
				var info = createElement('div', null, {id: 'profile_info'});
				info.appendChild(createElement('div', `ID: ${data.id}`, {id: 'profile_id'}));
				info.appendChild(createElement('div', `Username: ${data.username}`, {id: 'profile_username'}));
				info.appendChild(createElement('div', `Email: ${data.email}`, {id: 'profile_email'}));
				info.appendChild(createElement('div', `Number of posts: ${data.posts.length}`, {id: 'profile_posts'}));
				info.appendChild(createElement('div', `Number of people following: ${data.followed_num}`, {id: 'profile_followers'}));
        info.appendChild(createElement('div', 'Following:', {id: 'followers_container'}));
        if (data.followed_num == 0){
          info.appendChild(createElement('div', 'no info to show', {class: 'noinfomsg'}));
        }
        var followers = getUserNames(data.following);
        followers.then(function(f) {
          var followers_list = createElement('ul', null, {class: 'followersList'});
          for(var i=0; i<f.length; i++) {
            followers_list.appendChild(createElement('li', f[i], {class: 'follower'}));
          }
          info.appendChild(followers_list);
          info.appendChild(createElement('div', `History: `, {id: 'profile_history'}));
        })

				modalContent.appendChild(info);

				for (var i=0; i<data.posts.length; i++) {
          fetch(`${API_URL}/post?id=${data.posts[i]}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Token ${token}`
              }
            }).then(function(res) {
              res.json().then(function(post_content) {
                var historicalPost = createElement('div', null, {id: 'post_history'});
                historicalPost.appendChild(createElement('h4', `Created on ${Date(post_content.meta.published)}`, {class: 'post_history_published_date'}));
                var imageContainer = createElement('div', null, {class: 'post_history_image_container'});
                imageContainer.appendChild(createElement('img', null, { src: 'data:image/png;base64,'+post_content.src, alt: post_content.meta.description_text, class: 'post_history_image' }));
                imageContainer.appendChild(createElement('div', `Descrption: ${post_content.meta.description_text}`, {class: 'post_history_description'}));
                historicalPost.appendChild(imageContainer);
                modalContent.appendChild(historicalPost);
              })
            })
         }
			})
		})
	})
} else {
	user.innerHTML = "Login";
	document.getElementById('logoutButton').style.display = 'none';
	document.getElementById('updateButton').style.display = 'none';
	document.getElementById('newPostButton').style.display = 'none';
	document.getElementById('followBar').style.display = 'none';
	document.getElementById('unfollowBar').style.display = 'none';
}

function getCurrentUser(){
	if (window.localStorage)
        return window.localStorage.getItem('logged_in');
    else
        return null;
}

const logout = document.getElementById('logoutButton');
if (logout) {
	logout.addEventListener('click', function () {
		window.localStorage.clear();
		window.location = "/";
	})
}

function getDocHeight() {
	var D = document;
	return Math.max(
	    D.body.scrollHeight, D.documentElement.scrollHeight,
	    D.body.offsetHeight, D.documentElement.offsetHeight,
	    D.body.clientHeight, D.documentElement.clientHeight
	);
}

function getScrollXY() {
	var scrOfX = 0, scrOfY = 0;
	if( typeof( window.pageYOffset ) == 'number' ) {
	    //Netscape compliant
	    scrOfY = window.pageYOffset;
	    scrOfX = window.pageXOffset;
	} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
	    //DOM compliant
	    scrOfY = document.body.scrollTop;
	    scrOfX = document.body.scrollLeft;
	} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
	    //IE6 standards compliant mode
	    scrOfY = document.documentElement.scrollTop;
	    scrOfX = document.documentElement.scrollLeft;
	}
	return [ scrOfX, scrOfY ];
}

var p=10;

document.addEventListener("scroll", function (event) {
	if (getDocHeight() - 20 <= getScrollXY()[1] + window.innerHeight) { 
	  const newfeed = api.getFeedsFrom(p);
		newfeed
		.then(posts => {
		    posts['posts'].reduce((parent, post) => {

		        parent.appendChild(createPostTile(post));
		        
		        return parent;

		    }, document.getElementById('large-feed'))
		});
		p += 10;
	}
});


// follow and unfollow
var followButton = document.getElementById('followButton');
if (followButton) {
	followButton.addEventListener('click', function() {
		var user_to_follow = document.getElementById('add_follow').value;
		var token = window.localStorage.getItem('token');
		if (user_to_follow) {
			fetch(`${API_URL}/user/follow?username=${user_to_follow}`, {
				method: 'PUT',
				headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Token ${token}`
        }
			}).then(function(res) {
				document.getElementById('add_follow').value = '';
			})
		}
	})
}

var unfollowButton = document.getElementById('unfollowButton');
if (unfollowButton) {
	unfollowButton.addEventListener('click', function() {
		var user_to_unfollow = document.getElementById('remove_follow').value;
		var token = window.localStorage.getItem('token');
		if (user_to_unfollow) {
			fetch(`${API_URL}/user/unfollow?username=${user_to_unfollow}`, {
				method: 'PUT',
				headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Token ${token}`
        }
			}).then(function(res) {
				document.getElementById('remove_follow').value = '';
			})
		}
	})
}


