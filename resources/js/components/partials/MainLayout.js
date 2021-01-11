import React from 'react';

const MainLayout = ({ children }) => (
    <div className="wrapper">
        <div id="content" className="content-full">
        {children}
        </div>
    </div>
);
export default MainLayout;