import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    getAllBooks,
    delete: _delete,
    update
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function getAllBooks() {
    return dispatch => {
        dispatch(request());

        userService.getAllBooks()
            .then(
                books => dispatch(success(books)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(books) { return { type: userConstants.GETALL_SUCCESS, books } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}

function update(book) {
    return dispatch => {
        dispatch(request(book));

        userService.update(book)
            .then(
                user => dispatch(success(book)),
                error => dispatch(failure(book, error.toString()))
            );
    };

    function request(book) { return { type: userConstants.UPDATE_REQUEST, book } }
    function success(book) { return { type: userConstants.UPDATE_SUCCESS, book } }
    function failure(book, error) { return { type: userConstants.UPDATE_FAILURE, book, error } }
}