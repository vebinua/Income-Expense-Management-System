import axios from 'axios';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';

import * as Ladda from 'ladda';

import 'ladda/dist/ladda-themeless.min.css';

import FadeFlash from './partials/FadeFlash';
import ApiService from "./helpers/services/ApiService";
import DynamicDropdown from './helpers/DynamicDropdown';
import { HandleLogout } from './helpers/HandleLogout';

const EditWallet = (props) => {

	let loggedUserId = props.loggedUserId;
	let isServiceValid = false;
	let optionItems = false;
	let history = useHistory();
	
	const [flash, setFlash] = useState(false);
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [flashMessage, setFlashMessage] = useState('');
	const [currencyOptions, setCurrencyOptions] = useState([]);
	const ladda = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	let [wallet, setWallet] = useState({
		wallet_name: '',
		current_balance: '',
		currency_id: '',
		user_id: loggedUserId
	});

	let handleSubmit = (e) => {
		e.preventDefault();

		ladda.current.start();

		ApiService.putWallet(wallet, props.match.params.id)
		.then(response => {
			
			if (response.data.isUnauthorized) {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
				history.push({pathname: '/wallets'});
			}

			ladda.current.stop();
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on updating wallet. ' + error);
			ladda.current.stop();
		})
	}   

	let handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		console.log(value);

		wallet[name] = value;
		setWallet(wallet);
	}

	let showFlashMessage = (show, severity, flashMessage) => {
		setFlash(show);
		setSeverity(severity);
		setFlashMessage(flashMessage);

		setTimeout(() => {
    	setFlash(false);
    }, 3500);	
	}

	React.useEffect(() => {
		ladda.current = Ladda.create(document.querySelector('.btn-submit'));
		
		ApiService.getCurrencies()
		.then(response => {
			
			isServiceValid = ApiService.validateServiceResponse(response);
			
			if (isServiceValid) {
				setCurrencyOptions(response.data);
				console.log('currency options');
				console.log(currencyOptions);
				console.log(response.data);
			} else {
				showFlashMessage(true, 'error', 'Your session may have already expired, please login again.');
				HandleLogout();
				history.push({pathname: '/login'});
			}

			console.log('is service valid');
			console.log(isServiceValid);
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on fetching currency listings. ' + error);
		});

		ApiService.getUserWalletById(loggedUserId, props.match.params.id)
		.then(response => {
			
			if (response.data.isUnauthorized) {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
      	console.log(response.data);
      	wallet['wallet_name'] = response.data[0].wallet_name;
      	wallet['current_balance'] = response.data[0].current_balance / 100;
      	wallet['currency_id'] = response.data[0].currency_id;

      	setWallet(wallet);
      	setIsLoading(false);
      }
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on fetching wallet. ' + error);
		});		
	}, []);

	return(
			<div>
				<FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

				<h2>Edit wallet</h2>

				<div className="line"></div>

				 <div className="form-container">
					 <div className="row">
							 <div className="col-4">

									<form onSubmit={handleSubmit} className={isLoading ? "hide-form" : ""}>
								
										<div className="form-group">
											<label htmlFor="wallet_name">Wallet name</label>
											<input type="text" className="form-control" id="wallet_name" name="wallet_name" 
											placeholder="" onChange={handleChange} defaultValue={wallet['wallet_name']} />
										</div>

										<div className="form-row">
											<div className="form-group col-md-6">
												<label htmlFor="current_balance">Initial balance</label>
												<input type="text" className="form-control" id="current_balance" name="current_balance" 
												placeholder="" onChange={handleChange} defaultValue={wallet['current_balance']} />
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="currency_id">Currency</label>
													<DynamicDropdown data={currencyOptions}
														selectName={'currency_id'} 
														optionKey={'currency_id'} 
														optionValue={'currency_symbol'} 
														pleaseSelectMessage={'Select currency...'}
														defaultValueSelected={wallet['currency_id']}
														onChangeCallback={handleChange} />
											</div>
										</div>

										<input type="hidden" name="user_id" value={''}/>
										<div>
											<button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Update Wallet</button>
										</div>
									</form>

							 </div>
					 </div>
				 </div>
			</div>
	 );
}

export default EditWallet;

