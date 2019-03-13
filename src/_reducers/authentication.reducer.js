import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));
//default state is needed for initializing state (to keep user logged in after browser refresh)
const initialState = user ? { loggedIn: true, ...user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...action.user,
        loggingIn: true
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...action.user,
        loggedIn: true
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}