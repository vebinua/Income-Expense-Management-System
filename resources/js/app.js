import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/Dashboard');
require('./components/partials/Sidebar');

import Dashboard from './components/Dashboard';
import Networth from './components/Networth';
import CategoryListings from './components/CategoryListings';
import AddCategory from './components/AddCategory';
import AddSubcategory from './components/AddSubcategory';

import Sidebar from './components/partials/Sidebar';
import Header from './components/partials/Header';

const routing = (
  <Router>
    <div className="wrapper">
      <Sidebar />
        <div id="content">

        <Header />

        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/net-worth" component={Networth} />
          <Route path="/category/listings" component={CategoryListings} />
          <Route path="/category/add-category" component={AddCategory} />
          <Route path="/category/add-subcategory" component={AddSubcategory} />
        </Switch>
        </div>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));