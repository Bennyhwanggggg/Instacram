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

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null, 
        { src: 'data:image/png;base64,'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    section.appendChild(createElement('h4', post.meta.description_text, { class: 'post-description' }));

    const number_of_likes = post.meta.likes.length;
    if (number_of_likes > 0) {
        if (number_of_likes > 1) {
            section.appendChild(createElement('h5', `${number_of_likes} likes`, {class: 'post-like' }));
        } else {
            section.appendChild(createElement('h5', `${number_of_likes} like`, {class: 'post-like' }));
        }
    } else {
        section.appendChild(createElement('h5', `0 likes`, {class: 'post-like' }));
    }

    const number_of_comments = post.comments.length;
    if (number_of_comments > 0) {
        if (number_of_comments > 1) {
            section.appendChild(createElement('h5', `${number_of_comments} comments`, {class: 'post-comment'}));
        } else {
            section.appendChild(createElement('h5', `${number_of_comments} comment`, {class: 'post-comment'}));
        }
    } else {
        section.appendChild(createElement('h5', `${number_of_comments} comments`, {class: 'post-comment'}));
    }

    section.appendChild(createElement('h6', post.meta.published, { class: 'post-time'}));

    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

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
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
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