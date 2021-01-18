import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { location } = this.props;

    const dashboardClass = location.pathname === "/" ? "active" : "";
    const networthClass = location.pathname.match(/^\/net-worth/) ? "active" : "";
    const categoriesClass = location.pathname.match(/^\/categories/) ? "active" : "";
    const walletClass = location.pathname.match(/^\/wallet/) ? "active" : "";
    
    //set auth here
    const isLoggedIn =  localStorage.getItem('access_token') ? true : false;
    
     return(
        !isLoggedIn ? null
        : (
        <nav id="sidebar">
            <div className="sidebar-header">
                <h3>IEMS</h3>
            </div>

            <ul className="list-unstyled components">
                <p>Income & Expense Manager</p>
                <li className={dashboardClass}>
                  <Link to="/" aria-expanded="false">Dashboard</Link>
                </li>
                <li className={networthClass}>
                  <Link to="/wallets" aria-expanded="false">Wallets</Link>
                </li>
                <li className={networthClass}>
                  <Link to="/net-worth" aria-expanded="false">Net Worth</Link>
                </li>
                <li>
                    <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Transactions</a>
                    <ul className="collapse list-unstyled" id="pageSubmenu">
                        <li>
                            <a href="#">Add Income</a>
                        </li>
                        <li>
                            <a href="#">Add Expense</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#pageAssets" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Assets</a>
                    <ul className="collapse list-unstyled" id="pageAssets">
                        <li>
                            <a href="#">View Assets</a>
                        </li>
                        <li>
                            <Link to="/asset/add" aria-expanded="false">Add</Link>
                        </li>
                    </ul>
                </li>
                 <li>
                    <a href="#pageLiabilities" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Liabilities</a>
                    <ul className="collapse list-unstyled" id="pageLiabilities">
                        <li>
                            <a href="#">Listings</a>
                        </li>
                        <li>
                            <a href="#">Add</a>
                        </li>
                    </ul>
                </li>
                <li className={categoriesClass}>
                    <a href="#categories" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Account Categories</a>
                    <ul className="collapse list-unstyled" id="categories">
                        <li>
                            <Link to="/category/view" aria-expanded="false">View Categories</Link>
                        </li>
                        <li>
                            <Link to="/category/add-category" aria-expanded="false">Add Category</Link>
                        </li>
                        <li>
                            <Link to="/category/add-subcategory" aria-expanded="false">Add Subcategory</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>)
    );
  }
}

export default withRouter(Sidebar);