import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute';

import Dashboard from './Dashboard';
import Networth from './Networth';
import CategoryListings from './CategoryListings';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import AddSubcategory from './AddSubcategory';
import Login from './Login';
import SignUp from './SignUp';

import MainLayout from './partials/MainLayout';
import AuthLayout from './partials/AuthLayout';


import LandingAfterSignup from './landings/AfterSignup';


class App extends Component {
  
  constructor (props) {

    super(props);
    this.state = {
      isLogged: false
    }
  }

  render() {
    const isLoggedIn =  localStorage.getItem('access_token') ? true : false;
    
    let wrapperClassName = (isLoggedIn) ? 'content-logged' : 'content-full';
    let authRoutesPath = [
      '/',
      '/category/listings',
      '/category/add-category'
    ];

    return (
      <Router basename={'iems/Income-Expense-Management-System/'}>
        <div className="wrapper">
        <Switch>
          <Route path={['/login', '/signup']}>
            <MainLayout>
                <Route path={"/login"} component={Login} />
                <Route path={"/signup"} component={SignUp} />
            </MainLayout>
          </Route>
          <Route path={['/', '/category/listings']}>
            <AuthLayout>
                <PrivateRoute exact path={"/"} component={Dashboard} />
                <PrivateRoute path={"/category/listings"} component={CategoryListings} />
                <PrivateRoute path={"/category/add-category"} component={AddCategory} />
            </AuthLayout>
          </Route>
        </Switch>
        </div>
      </Router>
      /*<Router basename={'iems/Income-Expense-Management-System/'}>
        <div className="wrapper">
          <Sidebar />
            <div id="content" className={wrapperClassName}>
            <Header />

            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/net-worth" component={Networth} />
              <PrivateRoute path={"/category/listings"} component={CategoryListings} />
              <PrivateRoute path={"/category/add-category"} component={AddCategory} />
              <Route path={"/category/add-subcategory"} component={AddSubcategory} />
              <PrivateRoute path={"/category/:id/edit"} component={EditCategory} />
              <Route path={"/login"} component={Login} />
              <Route path={"/signup"} component={SignUp} />
              <Route path={"/thank-you"} component={LandingAfterSignup} />
            </Switch>
            </div>
        </div>
      </Router>*/
  )}
}

export default App;