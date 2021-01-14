import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute';

import Dashboard from './Dashboard';
import Networth from './Networth';
import ViewCategory from './ViewCategory';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import AddSubcategory from './AddSubcategory';
import Wallet from './Wallet';
import AddWallet from './AddWallet';
import Login from './Login';
import SignUp from './SignUp';

import MainLayout from './partials/MainLayout';
import AuthLayout from './partials/AuthLayout';

import LandingAfterSignup from './landings/AfterSignup';


class App extends Component {
  
  constructor (props) {

    super(props);
  }

  render() {
    let authRoutesPath = [
      '/',
      '/category/listings',
      '/category/add-category',
      'category/:id/edit',
      '/wallet/add'
    ];

    return (
      <Router basename={'iems/Income-Expense-Management-System/'}>
        <div className="wrapper">
        <Switch>
          <Route path={['/login', '/signup', '/thank-you']}>
            <MainLayout>
              <Route path={"/login"} component={Login} />
              <Route path={"/signup"} component={SignUp} />
              <Route path={"/thank-you"} component={LandingAfterSignup} />
            </MainLayout>
          </Route>
          <Route path={authRoutesPath}>
            <AuthLayout>
              <PrivateRoute exact path={"/"} component={Dashboard} />
              <PrivateRoute path={"/category/view"} component={ViewCategory} />
              <PrivateRoute path={"/category/add-category"} component={AddCategory} />
              <PrivateRoute path={"/category/:id/edit"} component={EditCategory} />
              <PrivateRoute path={"/wallet/add"} component={AddWallet} />
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