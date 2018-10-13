const API_URL = 'http://127.0.0.1:8080/data'

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

function setloggedin(usr, name) {
    window.localStorage.setItem('logged_in', usr);
    window.localStorage.setItem('curr_user', name);
    console.log('logged in now');
}


function login() {
	var usr = document.getElementById('usr').value;
	var pw = document.getElementById('password').value;
	var data = api.makeAPIRequest('users.json');
	var valid = false;
	data.then(function(res) {
		for(var i=0; i<res.length; i++) {
			if (res[i]['username'] == usr) {
				setloggedin(usr, res[i]['name']);
				valid=true
				window.location = "/";
				break;
			}
		}
		if (!valid) {
			document.getElementById('status').innerHTML = 'Invalid username/password';
		}
	})
}

function register() {
	var usr = document.getElementById('usr').value;
	var pw = document.getElementById('password').value;
	var data = api.makeAPIRequest('users.json');
	data.then(function(res) {
		for(var i=0; i<res.length; i++) {
			if (res[i]['username'] == usr) {
				document.getElementById('status').innerHTML = 'This username is already taken';
				window.location = "/";
				break;
			}
		}
	})

}





