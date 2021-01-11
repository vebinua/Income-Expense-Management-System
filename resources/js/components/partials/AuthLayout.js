import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AuthLayout = ({ children }) => (
    <div className="wrapper">
      <Sidebar />
        <div id="content" className="content-logged">
        <Header />
        {children}
        </div>
    </div>
);
export default AuthLayout;