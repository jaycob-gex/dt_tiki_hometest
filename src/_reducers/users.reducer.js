import { userConstants } from '../_constants';
import { debug } from 'util';

export function books(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      /*action:
      {
        books: []
      }
      */
      return {
        items: action.books
      }
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to book being deleted
      return {
        ...state,
        items: state.items.map(book =>
          book._id === action.id
            ? { ...book, deleting: true }
            : book
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted book from state
      return {
        items: state.items.filter(book => book._id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to book 
      return {
        ...state,
        items: state.items.map(book => {
          if (book._id === action.id) {
            // make copy of book without 'deleting:true' property
            const { deleting, ...bookCopy } = book;
            // return copy of book with 'deleteError:[error]' property
            return { ...bookCopy, deleteError: action.error }
          }

          return book;
        })
      };

    case userConstants.UPDATE_REQUEST:
      return {
        ...state,
        items: state.items.map(book =>
          book._id === action.book._id
            ? { ...book, updating: true }
            : book
        )
      }
    case userConstants.UPDATE_SUCCESS:
      // remove 'updating:true' property & update the current book
      return {
        ...state,
        items: state.items.map(book => {
          // action.book is the object of latest values
          if (book._id === action.book._id) {
            // make copy of action.book without 'updating:true' property
            const { updating, ...bookCopy } = action.book
            return { ...bookCopy}
          }

          return book;
        })
      }
    case userConstants.UPDATE_FAILURE:
      // remove 'updating:true' property and add 'updateError:[error]' property to book 
      return {
        ...state,
        items: state.items.map(book => {
          if (book._id === action.book._id) {
            // make copy of book without 'updating:true' property
            const { updating, ...bookCopy } = book;
            // return copy of book with 'deleteError:[error]' property
            return { ...bookCopy, updateError: action.error }
          }

          return book;
        })
      }

    default:
      return state
  }
}