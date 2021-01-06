import React, {Fragment} from "react";
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

const TopNavLinks = props => {
  let { isLoggedIn } = props; //use for authenticated views (later)
  let { location } = props;

  if(location.pathname.match(/^\/category\/add-category/)){
    return (
        <Fragment>
            <li className="nav-item"><Link to="/">View Categories</Link></li>
        </Fragment>
    );
  } else {
    return <button>Login - abc</button>;
  }
};


export default TopNavLinks;