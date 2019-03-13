import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

import { Panel } from './Panel'

class HomePage extends React.Component {
    // since this component is dynamically renderred using <PrivateRoute>
    // componentDidMount is only called after user is authenticated (defined in <PrivateRoute>)
    componentDidMount() {
        this.props.dispatch(userActions.getAllBooks());
    }

    handleDeleteBook = id => {
        return () => this.props.dispatch(userActions.delete(id));
    }

    handleUpdateBook = (book) => {
        return () => this.props.dispatch(userActions.update(book));
    }

    render() {
        const { books, user } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user ? user.username : ''}!</h1>
                <p>You're logged in with React!!</p>
                <h3>All books:</h3>
                {books.loading && <em>Loading books...</em>}
                {books.error && <span className="text-danger">ERROR: {books.error}</span>}
                {books.items &&
                    <ul>
                        {books.items.map((book, index) =>
                            <li key={book._id}>
                                {book.name + ' - ' + book.author}
                                <Panel user={{...user}} 
                                    book={book} 
                                    handleDeleteBook={this.handleDeleteBook}
                                    handleUpdateBook={this.handleUpdateBook}
                                />
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { books, authentication } = state;
    const { user } = authentication;
    return {
        user,
        books
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };