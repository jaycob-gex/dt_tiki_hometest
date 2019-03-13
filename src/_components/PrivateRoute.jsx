import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/* protected route for authenticated user only
** reference: https://viblo.asia/p/thiet-ke-protected-route-de-kiem-tra-trang-thai-xac-thuc-nguoi-dung-voi-react-router-v4-Qpmle9wmlrd
*/
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)