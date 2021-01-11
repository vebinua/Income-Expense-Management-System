import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

ReactDOM.render(<App />, document.getElementById('app'));