import React, {Fragment} from "react";
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

const TopNavLinks = props => {
  let { isLoggedIn } = props; //use for authenticated views (later)
  let { location } = props;

  let button = null;

    if(location.pathname.match(/^\/category\/add-category/)){
        button = <li className="nav-item"><Link to="/category/listings">View Categories</Link></li>;
    } else if (location.pathname.match(/^\/category\/listings/)) { 
        button = <li className="nav-item"><Link to="/category/add-category">Add Category</Link></li>;
    } else if (location.pathname.match(/^\/category\/(\d+)\/edit/)) {
        button = ( 
            <Fragment>
                <li className="nav-item"><Link to="/category/listings">View Categories</Link></li>
                <li className="nav-item"><Link to="/category/add-category">Add Category</Link></li>
            </Fragment>
        )
    } else {
        button = <button>Login - abc</button>;
    }

    return (
        <Fragment>{button}</Fragment>
    );
};


export default TopNavLinks;