import React from 'react';
//import AuthService from './Services/AuthService';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  const isLogged =  !localStorage.getItem('access_token') ? false : true;
  const loggedUserId =  localStorage.getItem('user_id') ? localStorage.getItem('user_id') : false; 
  
  console.log('isLoggedIn from PrivateRoute ' + isLogged + ' user id: ' + loggedUserId);

  return (
    <Route
      {...rest}
      render={props =>
        isLogged ? (
          <Component {...props} foo='bar' isLogged={isLogged} loggedUserId={loggedUserId} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location, user_id: loggedUserId } }} />
        )
      }
    />
  )
}

export default PrivateRoute;