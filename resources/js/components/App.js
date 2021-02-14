import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute';

import Dashboard from './Dashboard';
import Networth from './Networth';
import Categories from './Categories';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import AddSubcategory from './AddSubcategory';
import Wallets from './Wallets';
import AddWallet from './AddWallet';
import EditWallet from './EditWallet';
import Transactions from './Transactions';
import AddTransaction from './AddTransaction';
import Login from './Login';
import SignUp from './SignUp';
import Canvas from './Canvas';
import ScrollDialog from './ScrollDialog';

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
      '/wallets/add',
      '/wallets',
      '/transactions',
      '/transactions/add'
    ];

    return (
      <Router basename={window.config.routeBase}>
         <div className="wrapper">
         <Switch>
            <Route path={['/login', '/signup', '/thank-you']}>
               <MainLayout>
                 <Switch>
                    <Route path={"/login"} component={Login} />
                    <Route path={"/signup"} component={SignUp} />
                    <Route path={"/thank-you"} component={LandingAfterSignup} />
                  </Switch>
               </MainLayout>
            </Route>
            <Route path={authRoutesPath}>
               <AuthLayout>
                  <Switch>
                    <PrivateRoute exact path={"/"} component={Dashboard} />
                    <PrivateRoute path={"/categories"} component={Categories} />
                    <PrivateRoute path={"/category/add"} component={AddCategory} />
                    <PrivateRoute path={"/category/:id/edit"} component={EditCategory} />
                    <PrivateRoute path={"/category/subcategory/add"} component={AddSubcategory} />
                    <PrivateRoute path={"/wallets/add"} component={AddWallet} />
                    <PrivateRoute path={"/wallets/:id/edit"} component={EditWallet} />
                    <PrivateRoute path={"/wallets"} component={Wallets} />
                    <PrivateRoute path={"/transactions/add"} component={AddTransaction} />
                    <PrivateRoute path={"/transactions"} component={Transactions} />
                    <PrivateRoute path={"/canvas"} component={Canvas} />
                  </Switch>
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