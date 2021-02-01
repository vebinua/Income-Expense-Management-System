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

class EditCategory extends React.Component {

	 constructor (props) {
			super(props);

			console.log('constructor!');

				super(props);
				this.state = {
					categories: [],
					category: '',
					account_type: 'asset',
					user_id: 0,
					loading: false,
					flash: false,
					flashHandle: false,
      			severity: 'success',
					flashMessage: '',
					isLoading: true,
					isLogged: props.isLogged,
					loggedUserId: props.loggedUserId,
					redirect: false,
					forceLogout: false
				}
				
			// bind
			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
			this.onOptionChange = this.onOptionChange.bind(this);
			this.runAfterRender = this.runAfterRender.bind(this);
		}

		clearFields() {
			this.setState({ category: ''});
			this.setState({ account_type: 'asset'});
		}

		onOptionChange(e) {
			this.setState({
				account_type: e.target.value
			});

			console.log('onOptionChange', e.target.value);
		}

		handleChange(e) {
				this.setState({
					 [e.target.name]: e.target.value
				});
				console.log('onChange', e.target.name);
		}

		
		handleSubmit(e) {
			e.preventDefault();
			let _btn = this.ladda;
			let _this = this;
	      let severity = 'success';
      	let flashMessage = '';

			const data = {
				'category': this.state.category,
				'account_type': this.state.account_type,
				'user_id': this.state.user_id
			};

			this.ladda.start();

			const token = localStorage.getItem('access_token');
      	axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      	
			axiosInstance.put('/api/categories/' + this.props.match.params.id, {data}, {
			   params: {
          		token: token
        		}
			})
	 	   .then(response => {
	 	   	console.log('ON PUT!');
	 	   	console.log(response);

				if (response.data.action == 'JWT_FAIL_TOKEN_INVALID' || response.data.action == 'JWT_FAIL_TOKEN_EXPIRED') {
					severity = 'error';
				 	flashMessage = 'You\'re session has expired. Please login again.';
				 	
					_this.setState({forceLogout: true});
				
				} else if (response.data.action == 'JWT_FAIL_TOKEN_MISSING') {
				 	severity = 'error';
				 	flashMessage = 'You are unauthorized to update a category. We will log you out and try signing in again.';
				 
				 	_this.setState({forceLogout: true});
				
				} else {

					console.log(response);

			 	 	/*_this.setState({
		          	category: response.data.category,
	          		account_type: response.data.account_type,
		          	user_id: response.data.user_id
		        	});*/

			 	 	severity = 'success';
		        	flashMessage = response.data.message;

		        	this.ladda.stop();
				}	      	

				_this.setState({ flash: true});
				_this.setState({ severity: severity});
				_this.setState({ flashMessage: flashMessage});

				_this.flashHandle = setTimeout(() => {
			 		_this.setState({ flash: false});

			 		if (this.state.forceLogout) {
			 			HandleLogout();
			 			_this.setState({redirect: true});
			 		}
				}, 3500);
	      })
	      .catch((error) => {
	        console.log(error);
	      });
		}

		componentDidMount() {
			
			this.ladda = Ladda.create(document.querySelector('.btn-submit'));

			const token = localStorage.getItem('access_token');
			const userId = this.state.loggedUserId;

		 	let _this = this;
		   let severity = 'success';
		   let flashMessage = '';

			axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			axiosInstance.get('/api/categories/' + this.props.match.params.id + '/edit', {
			 	params: {
		        token: token
		      }
			})
	      .then(response => {

			if (response.data.action == 'JWT_FAIL_TOKEN_INVALID' || response.data.action == 'JWT_FAIL_TOKEN_EXPIRED') {
				severity = 'error';
			 	flashMessage = 'You\'re session has expired. Please login again.';
			 	
				_this.setState({forceLogout: true});
			
			} else if (response.data.action == 'JWT_FAIL_TOKEN_MISSING') {
			 	severity = 'error';
			 	flashMessage = 'You are unauthorized to add a category. We will log you out and try signing in again.';
			 
			 	_this.setState({forceLogout: true});
			
			} else {

				console.log(response);

		 	 	_this.setState({
	          	category: response.data.category,
          		account_type: response.data.account_type,
	          	user_id: response.data.user_id,
	          	isLoading: false
	        	});

	        	return false;
			}	      	

			_this.setState({ flash: true});
			_this.setState({ severity: severity});
			_this.setState({ flashMessage: flashMessage});

			_this.flashHandle = setTimeout(() => {
		 		_this.setState({ flash: false});

		 		if (this.state.forceLogout) {
		 			HandleLogout();
		 			_this.setState({redirect: true});
		 		}
			}, 3500);

	      })
	      .catch((error) => {
	        console.log(error);
	      });
		}  
		
	  	componentWillUnmount() {

    		clearTimeout(this.flashHandle);

  		}

		runAfterRender() {
			console.log('rendered!');
		}

		

	render() {
		
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
 
				<h2>Edit Category</h2>
				
				<div className="line"></div>
				
				<div className="form-container">
					<div className="row">
						<div className="col-4">

							<form onSubmit={this.handleSubmit} className={this.state.isLoading ? "hide-form" : ""}>
						
								<div className="form-group">
									<label htmlFor="Category">Category</label>
									<input type="text" className="form-control" id="category" name="category" placeholder="Category" value={this.state.category} 
									onChange={this.handleChange}  />
								</div>

								<div className="form-group">
									<label>Account Type</label>
									<div className="custom-control custom-radio">
											<input type="radio" id="asset" name="account_type" value="asset" className="custom-control-input" 
											checked={this.state.account_type === 'asset'} 
											onChange={this.onOptionChange} />
											<label className="custom-control-label" htmlFor="asset">Asset</label>
									</div>
									<div className="custom-control custom-radio">
											<input type="radio" id="liability" name="account_type" value="liability" className="custom-control-input" 
											checked={this.state.account_type === 'liability'} 
											onChange={this.onOptionChange} />
											<label className="custom-control-label" htmlFor="liability">Liability</label>
									</div>
								</div>

								<input type="hidden" name="user_id" value={this.state.user_id}/>
								<div onLoad={this.runAfterRender}>
									<button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Update Category</button>
								</div>
							</form>
						</div>
					</div>
				</div>

			</div>


		)
	}
}
export default EditCategory;
