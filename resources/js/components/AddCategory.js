import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as Ladda from 'ladda';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

// import the ladda theme directly from the ladda package.
import 'ladda/dist/ladda-themeless.min.css';
import { HandleLogout } from './helpers/HandleLogout';

export const axiosInstance = axios.create({
  baseURL: window.config.baseUrl
});

const styles = {
  alert: {
    left: '0',
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: '1500',
  }
};

class AddCategory extends React.Component {

  constructor (props) {

    super(props)
    this.state = {
      categories: [],
      category: '',
      accountType: 'asset',
      loading: false,
      flash: false,
      flashHandle: false,
      severity: 'success',
      flashMessage: '',
      isLogged: props.isLogged,
      loggedUserId: props.loggedUserId,
      redirect: false
    }
        
    // bind
    this.handleLoad = this.handleLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.runAfterRender = this.runAfterRender.bind(this);

    window.addEventListener('load', this.handleLoad);
  }

    clearFields() {
      this.setState({ category: ''});
      this.setState({ accountType: 'asset'});
    }

    onOptionChange(e) {
      this.setState({
        accountType: e.target.value
      });
    }

    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

    handleSubmit(e) {
      e.preventDefault();
      
      let _btn = this.ladda;
      let _this = this;
      let severity = 'success';
      let flashMessage = '';

      const data = {
        'category': this.state.category,
        'account_type': this.state.accountType,
        'user_id': this.state.loggedUserId
      };

      this.ladda.start();
      
      const token = localStorage.getItem('access_token');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      axiosInstance.post('/api/categories/', {data},{
        params: {
          token: token
        },
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
      .then(function (response) {

        if (response.data.action == 'JWT_FAIL_TOKEN_INVALID' || response.data.action == 'JWT_FAIL_TOKEN_EXPIRED') {

          HandleLogout();
          _this.setState({redirect: true});

          return false;
        } else if (response.data.action == 'JWT_FAIL_TOKEN_MISSING') {
          severity = 'error';
          flashMessage = 'You are unauthorized to add a category. We will log you out and try signing in again.';
                    
          HandleLogout();
          _this.setState({redirect: true});
        } else {
          severity = 'success';
          flashMessage = 'Category has been successfully added.';
        }

        _this.setState({ flash: true});
        _this.setState({ severity: severity});
        _this.setState({ flashMessage: flashMessage});

        _this.flashHandle = setTimeout(() => {
          _this.setState({ flash: false});
        }, 3500);

        _btn.stop();
        _this.clearFields();
      })
      .catch(function (error) {
        _btn.stop();
          console.log(error);
          _this.clearFields();
      });
    }

  handleLoad(e) {
  }

  componentDidMount() {
    
    this.ladda = Ladda.create(document.querySelector('.btn-submit'));

    //const userId = this.state.loggedUserId;

    //console.log('from componentDidMount@AddCategory.js ' + userId); 
  }

  componentWillUnmount() {

    clearTimeout(this.flashHandle);

  }

  runAfterRender() {
    console.log('rendered!');
  }

  render() {
    //const [flash, setFlash] = useState(null);

    return (
      <div>
        {this.state.redirect ? (
        <Fragment>
          <Redirect to='/login' />  
        </Fragment>
        ): null }

        {
          <Fade in={this.state.flash} timeout={{ enter: 300, exit: 1000 }}>
          <Alert style={styles.alert} onClose={() => {}} severity={this.state.severity}>{this.state.flashMessage}</Alert>
          </Fade>
        }

        <h2>Add Category</h2>
        
        <div className="form-container">
          <div className="row">
            <div className="col-4">

              <form onSubmit={this.handleSubmit}>
            
                <div className="form-group">
                  <label htmlFor="Category">Category</label>
                  <input type="text" className="form-control" id="category" name="category" placeholder="Category" value={this.state.category} 
                  onChange={this.handleChange}  />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <div className="custom-control custom-radio">
                      <input type="radio" id="asset" name="account_type" value="asset" className="custom-control-input" 
                      checked={this.state.accountType === 'asset'} 
                      onChange={this.onOptionChange} />
                      <label className="custom-control-label" htmlFor="asset">Asset</label>
                  </div>
                  <div className="custom-control custom-radio">
                      <input type="radio" id="liability" name="account_type" value="liability" className="custom-control-input" 
                      checked={this.state.accountType === 'liability'} 
                      onChange={this.onOptionChange} />
                      <label className="custom-control-label" htmlFor="liability">Liability</label>
                  </div>
                </div>

                <input type="hidden" name="user_id" value={this.state.loggedUserId}/>
                <div onLoad={this.runAfterRender}>
                  <button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Add Category</button>
                </div>
              </form>

            </div>
          </div>
        </div>

      </div>
    )}
}

export default AddCategory;
