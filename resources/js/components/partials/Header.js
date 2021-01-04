import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';

class Header extends React.Component {

  render() {

     return( 
         <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    <button type="button" id="sidebarCollapse" className="btn btn-info">
                        <i className="fas fa-align-left"></i>
                        <span></span>
                    </button>
                    <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-align-justify"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/*<ul className="nav navbar-nav ml-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Page</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Page</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Page</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Page</a>
                            </li>
                        </ul>*/}
                    </div>
                </div>
            </nav>
          </div>
    );
  }
}

export default withRouter(Header);

/*function Sidebar() {

  const { location } = this.props;

  const dashboardClass = location.pathname === "/" ? "active" : "";
  const networthClass = location.pathname.match(/^\/net-worth/) ? "active" : "";
  const contactClass = location.pathname.match(/^\/contact/) ? "active" : "";
  


   
}*/

//export default Sidebar;