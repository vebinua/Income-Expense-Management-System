import React, {Fragment,useState} from "react";
import { Redirect, Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

const TopNavLinks = props => {
	let { isLoggedIn } = props; //use for authenticated views (later)
	let { location } = props;

	let button = null;

	const [redirect, setRedirect] = useState(false);
  
	const handleLogout = (e) => {
		e.preventDefault();

		localStorage.removeItem("access_token");
   	localStorage.removeItem("expires_in");
   	localStorage.removeItem("user_id");
   	localStorage.removeItem("first_name");
   	setRedirect(true);
  };

	if(location.pathname.match(/^\/category\/add-category/)){
		button = <li className="nav-item"><Link to="/category/view">View Categories</Link></li>;
	} else if (location.pathname.match(/^\/category\/view/)) { 
		button = <li className="nav-item"><Link to="/category/add-category">Add Category</Link></li>;
	} else if (location.pathname.match(/^\/category\/(\d+)\/edit/)) {
		button = ( 
			<Fragment>
				<li className="nav-item"><Link to="/category/view">View Categories</Link></li>
				<li className="nav-item"><Link to="/category/add-category">Add Category</Link></li>
			</Fragment>
		)
	} else {
	}

	return (
	  	<Fragment>
      {redirect ? (
          <Redirect to='/login' />  
       ): null }
		
		{button}
		<li className="nav-item"><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
		</Fragment>
	);
};


export default TopNavLinks;