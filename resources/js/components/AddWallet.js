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

const AddWallet = (props) => {

	let loggedUserId = props.loggedUserId;
	let isServiceValid = false;
	let optionItems = false;
	let history = useHistory();
	
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [currencyOptions, setCurrencyOptions] = useState('');
  const [flash, setFlash] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
	const ladda = useRef(false);

	let [wallet, setWallet] = useState({
		wallet_name: '',
		initial_balance: '',
		currency_id: '',
		user_id: loggedUserId
	});

	let handleSubmit = (e) => {
		e.preventDefault();

		ladda.current.start();

		ApiService.postWallet(wallet)
		.then(response => {
			
			isServiceValid = ApiService.validateServiceResponse(response);
			
			if (isServiceValid) {
				history.push({pathname: '/wallets'});
			} else {
				showFlashMessage(true, 'error', 'Your session may have already expired, please login again.');
				HandleLogout();
				history.push({pathname: '/login'});
			}

			ladda.current.stop();
			console.log(isServiceValid);
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on saving wallet. ' + error);
			ladda.current.stop();
		})
	}   

	let handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;

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
			} else {
				showFlashMessage(true, 'error', 'Your session may have already expired, please login again.');
				HandleLogout();
				history.push({pathname: '/login'});
			}
			console.log(isServiceValid);
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on fetching currency listings. ' + error);
		})
	}, []);

	return(
			<div>
				<FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

				<h2>Add wallet</h2>

				 <div className="form-container">
					 <div className="row">
							 <div className="col-4">

									<form onSubmit={handleSubmit}>
								
										<div className="form-group">
											<label htmlFor="wallet_name">Wallet name</label>
											<input type="text" className="form-control" id="wallet_name" name="wallet_name" 
											placeholder="" onChange={handleChange} />
										</div>

										<div className="form-row">
											<div className="form-group col-md-6">
												<label htmlFor="initial_balance">Initial balance</label>
												<input type="text" className="form-control" id="initial_balance" name="initial_balance" 
												placeholder="" onChange={handleChange} />
											</div>
											<div className="form-group col-md-6">
												<label htmlFor="currency_id">Currency</label>
												<select id="currency_id" name="currency_id" className="form-control" onChange={handleChange} defaultValue="-">
													<option value="-">Select currency...</option>
													<DynamicDropdown data={currencyOptions} optionKey={'currency_id'} optionValue={'currency_symbol'} />
												</select>
											</div>
										</div>

										<input type="hidden" name="user_id" value={''}/>
										<div>
											<button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Save</button>
										</div>
									</form>

							 </div>
					 </div>
				 </div>
			</div>
	 );
}

export default AddWallet;

