import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    getAllBooks,
    update,
    delete: _delete
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/auth`, requestOptions)
        .then(handleResponse)
        .then(user => {
            /*user details:
            {
                id: '...',
                role: '...',
                username: '...',
                exp: '...',
                iat: '...'
            }*/
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAllBooks() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    /*send GET to http://localhost:3001
    config is defined in webpack.config*/
    /*returned data sample:
    {
        books: []
    }
    */
    return fetch(`${config.apiUrl}`, requestOptions).then(handleResponse);
}

function update(book) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    };

    return fetch(`${config.apiUrl}/admin/update/${book._id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/admin/delete/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {
                // auto logout after 3s if 401 response returned from api
                setTimeout(() => {
                    logout();
                    location.reload(true);
                }, 3000)
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}