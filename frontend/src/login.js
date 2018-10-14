const API_URL = 'http://localhost:5000';

const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));


class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 

    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

    /**
     * @returns feed array in json format
     */
    getFeed() {
        return this.makeAPIRequest('feed.json');
    }

    /**
     * @returns auth'd user in json format
     */
    getMe() {
        return this.makeAPIRequest('me.json');
    }

}


const api  = new API();

function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null
}

function setloggedin(usr, token) {
    window.localStorage.setItem('logged_in', usr);
    window.localStorage.setItem('token', token);
}


function login() {
	var usr = document.getElementById('usr').value;
	var pw = document.getElementById('password').value;

	fetch('http://localhost:5000/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					username : usr,
					password :pw
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(res) {
				if (res.status == 200) {
					res.json().then(function(token) {
						setloggedin(usr, token['token']);
						window.location = "/";
					})
				} else {
					document.getElementById('status').innerHTML = 'Invalid username/password';
				}
			});
}


function register() {
	var usr = document.getElementById('usr').value;
	var pw = document.getElementById('password').value;
	var usr_name = document.getElementById('name').value;
	var usr_email = document.getElementById('email').value;
	// var data = api.makeAPIRequest('auth/signup');
	// console.log(data);
	fetch('http://localhost:5000/auth/signup', {
				method: 'POST',
				body: JSON.stringify({
					username : usr,
					password : pw,
					name : usr_name,
					email : usr_email
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(res) {
				if (res.status == 200) {
					window.location = "/";
				} else {
					document.getElementById('status').innerHTML = 'Invalid username/password';
				}
			});
}





