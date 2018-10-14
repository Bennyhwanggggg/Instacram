const API_URL = 'http://localhost:5000';
var token = window.localStorage.getItem('token');

/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

export function getUserNames(list_of_ids) {

    const result = list_of_ids.map(id => {
        return fetch(`${API_URL}/user?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Token ${token}`
            }
        })
        .then(function(res) {
            return res.json();
        });
    })

    var list_of_usernames = Promise.all(result).then(res => res.map(response => response.name));
    return list_of_usernames;
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {

    var token = window.localStorage.getItem('token');

    const section = createElement('section', null, { class: 'post' , id: post.id});

    const post_title = createElement('a', post.meta.author, {href: '#modalWindow'});

    post_title.addEventListener('click', function() {
        clearModalContent();
        var modalContent = document.getElementById('modalContent');
        fetch(`${API_URL}/user?username=${post.meta.author}`, {
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
                // info.appendChild(createElement('div', 'Following:', {id: 'followers_container'}));

                // if (data.followed_num == 0){
                //     info.appendChild(createElement('div', 'no info to show', {class: 'noinfomsg'}));
                // }

                // var followers = getUserNames(data.following);
                // followers.then(function(f) {
                //     var followers_list = createElement('ul', null, {class: 'followersList'});
                //     for(var i=0; i<f.length; i++) {
                //         followers_list.appendChild(createElement('li', f[i], {class: 'follower'}));
                //     }
                //     info.appendChild(followers_list);
                // })

                info.appendChild(createElement('div', `History: `, {id: 'profile_history'}));

                // info.appendChild(createElement('div', `History: `, {id: 'profile_history'}));
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

    const post_title_wrapper = createElement('h2', null, { class: 'post-title'});
    post_title_wrapper.appendChild(post_title);
    section.appendChild(post_title_wrapper);

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    const post_interactive = createElement('div', null, {class: 'post-interactive'});
    var like_button = createElement('span', 'like', {class: 'like_button' });

    // check if a post is already liked by the user
    fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${token}`
        }
    }).then(function(res) {
        if (res.status == 200) {
            res.json().then(data => {
                for (var i=0; i<post.meta.likes.length; i++) {
                    if (post.meta.likes[i] == data.id) {
                        like_button.textContent = 'liked';
                    }
                }
            })
        }
    })

    var number_of_likes = post.meta.likes.length;
    var liked_people = createElement('a', `${number_of_likes} likes`, {class: 'post-like', href: '#modalWindow'})
    if (number_of_likes == 1) {
        liked_people.textContent = `${number_of_likes} like`
    }


    like_button.addEventListener('click', function() {
        var query = `${API_URL}/post/like?id=${post.id}`;
        fetch(query, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Token ${token}`
            }
        }).then(function(res) {
            if (res.status==200 && like_button.textContent != 'liked') {
                like_button.textContent = 'liked';
                number_of_likes++;
                if (number_of_likes == 1){
                    liked_people.textContent = `${number_of_likes} like`;
                } else {
                    liked_people.textContent = `${number_of_likes} likes`;
                }
            }
        })
        .catch(err => console.warn(`API_ERROR: ${err.message}`));
    })
    post_interactive.appendChild(like_button);

    section.appendChild(post_interactive);

    section.appendChild(createElement('h4', post.meta.description_text, { class: 'post-description' }));

    liked_people.addEventListener('click', function() {

        fetch(`${API_URL}/post?id=${post.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Token ${token}`
            }
        }).then(function(res) {
            res.json().then(function(data) {
                var people = getUserNames(data.meta.likes);
                 people.then(function(names) {
                    var modalContent = document.getElementById('modalContent');
                    clearModalContent();
                    modalContent.appendChild(createElement('div', 'People who liked this:', {class: 'liked_title'}));
                    if (names.length == 0) {
                        modalContent.appendChild(createElement('p', 'no one has liked this post yet.', {class: 'liked_title'}));
                    }
                    var liked_users_list = createElement('ul', name, {class: 'liked_users'});
                    for (var i=0; i<names.length; i++){
                        var name = names[i];
                        liked_users_list.appendChild(createElement('li', name, {class: 'liked_users'}));
                    }
                    modalContent.appendChild(liked_users_list);
                })
            });
        })
    })

    section.appendChild(liked_people);

    var number_of_comments = post.comments.length;
    var comments_button = createElement('a', `${number_of_comments} comments`, {class: 'see_comments', href: '#modalWindow'})
    if (number_of_comments == 1) {
        comments_button.textContent = `${number_of_comments} comment`;
    }

    comments_button.addEventListener('click', function() {
        clearModalContent();

        fetch(`${API_URL}/post?id=${post.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Token ${token}`
            }
        }).then(function(res) {
            res.json().then(function(data) {
                var modalContent = document.getElementById('modalContent');
                if (data.comments.length == 0) {
                    modalContent.appendChild(createElement('div', 'No comments', {class: 'user_comments'}));
                }
                for (var i=0; i<data.comments.length; i++) {
                    modalContent.appendChild(createElement('li', data.comments[i].comment, {class: 'user_comments'}));
                }
            });
        })
    })


    // <input type="text" name="lgafilter3" id="lgafilter3">
    var comment_box = createElement('div', null, {class: 'comment_box'})
    var comment_content = createElement('input', null, {type: "text", name: "post_comment", class: "post_comment", placeholder: "insert comment here..."})
    comment_box.appendChild(comment_content);
    var post_comment_button = createElement('button', 'post comment', {name: 'post_comment_button'})

    post_comment_button.addEventListener('click', function() {
        var newComment = comment_content.value;
        if (newComment){
            fetch(`${API_URL}/post/comment?id=${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    comment : newComment
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token ${token}`
                }
            }).then(function(response) {
                if (response.status == 200) {
                    comment_content.value = '';
                    number_of_comments++;
                    if (number_of_comments == 1) {
                        comments_button.textContent = `${number_of_comments} comment`;
                    } else {
                        comments_button.textContent = `${number_of_comments} comments`;
                    }
                }
            })
        }
    })



    section.append(comments_button);
    comment_box.appendChild(post_comment_button);

    section.appendChild(comment_box);
    section.appendChild(createElement('h6', Date(post.meta.published), { class: 'post-time'}));

    return section;
}

// Clear model content
export function clearModalContent() {
    var modalContent = document.getElementById('modalContent');
    while(modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage() {

    var input = document.querySelector('input[type="file"]');
    var [ file ] = input.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const base64Data = dataURL.split(',')[1];

        const description = document.getElementById('description').value;

        fetch(`${API_URL}/post`, {
            method: 'POST',
            body: JSON.stringify({
                description_text : description,
                src : base64Data
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Token ${token}`
            }
        }).then(function(res) {
            if (res.status == 200) {
                document.getElementById('status').innerHTML = 'Success!';
                document.getElementById('description').value = '';
            } else {
                document.getElementById('status').innerHTML = 'Failed to post!';
            }
        })
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}