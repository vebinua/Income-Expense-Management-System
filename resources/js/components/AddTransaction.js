import axios from 'axios';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import renderHTML from 'react-render-html';

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import * as Ladda from 'ladda';

import 'ladda/dist/ladda-themeless.min.css';

import FadeFlash from './partials/FadeFlash';
import AlertNotify from './partials/AlertNotify';
import ApiService from "./helpers/services/ApiService";
import DynamicDropdown from './helpers/DynamicDropdown';
import { HandleLogout } from './helpers/HandleLogout';

const AddTransaction = (props) => {

	let loggedUserId = props.loggedUserId;
	let isServiceValid = false;
	let optionItems = false;
	let history = useHistory();
	
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [currencyOptions, setCurrencyOptions] = useState('');
	const [wallets, setWallets] = useState([]);
	const [categories, setCategories] = useState([]);
  const [flash, setFlash] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [alertNotifyMessage, setAlertNotifyMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const ladda = useRef(false);


  const [transaction, setTransaction] = useState({
		category_id: '',
		wallet_id: '',
		currency_id: '',
		amount: '',
		note: '',
		transaction_date: new Date(),
		user_id: loggedUserId
	});

	let handleSubmit = (e) => {
		e.preventDefault();

		ladda.current.start();

		console.log(transaction);
		ApiService.postTransaction(transaction)
		.then(response => {
			
			isServiceValid = ApiService.validateServiceResponse(response);
			
			if (isServiceValid) {
				history.push({pathname: '/transactions'});
			} else {
				showFlashMessage(true, 'error', 'Your session may have already expired, please login again.');
				HandleLogout();
				history.push({pathname: '/login'});
			}

			ladda.current.stop();
			console.log(isServiceValid);
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on saving transaction. ' + error);
			ladda.current.stop();
		})
	}   

	let handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		transaction[name] = value;

		setTransaction(transaction);

		console.log(transaction);
		console.log('on changd called!' + value);
		//console.log('value: ' + value + ' name: ' + name);
		//console.log(transaction['currency_id']);   
	}

  let handleDateChange = (date) => {
    
    console.log('handling date change!');

    setSelectedDate(date);

    transaction['transaction_date'] = date;
		setTransaction(transaction);
  };

  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    setTimeout(() => {
      setFlash(false);
      callback();
    }, 3500); 
  }

	function fetchWallets() {

    ApiService.getWalletsByUser(loggedUserId)
    .then(response => {
      
      isServiceValid = ApiService.validateServiceResponse(response);
      
      if (isServiceValid) {

      	console.log(response.data.length);
        
        if (response.data.length == 0) {
      		let msg = renderHTML("No wallets found. You must have a wallet to make a transaction. Would you like to <a href='"+window.config.baseUrl+"wallets/add'>add wallet</a> now?");
        	setAlertNotifyMessage(msg);
        	setShowAlert(true);
        	setHasWallet(false);
        } else {
        	setHasWallet(true);
        	setWallets(response.data);
        	ladda.current = Ladda.create(document.querySelector('.btn-submit'));

        	transaction['wallet_id'] = response.data[0].wallet_id;
      		setTransaction(transaction);
        	
      		//var el = document.getElementById('wallet_name');
					//el.dispatchEvent(new Event('change'));
					//transaction['wallet_name'] = 2;
					//setTransaction(transaction);
        }

      } else {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      }
    })
    .catch((error) => {
      showFlashMessage(true, 'error', 'Error on fetching wallets. ' + error, null);
    })
  }

  function fetchCurrencies() {
  	ApiService.getCurrencies()
		.then(response => {
			
			isServiceValid = ApiService.validateServiceResponse(response);
			
			if (isServiceValid) {
				setCurrencyOptions(response.data);

      	transaction['currency_id'] = response.data[0].currency_id;
      	setTransaction(transaction);
			} else {
				showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
			}
			console.log(isServiceValid);
		})
		.catch((error) => {
			showFlashMessage(true, 'error', 'Error on fetching currency listings. ' + error);
		})
	}
	
	function fetchCategories() {
		ApiService.getCategoriesByUser(loggedUserId)
    .then(response => {
      
      isServiceValid = ApiService.validateServiceResponse(response);
      
      if (isServiceValid) {

      	console.log(response.data.length);
        
        if (response.data.length == 0) {
      	
        } else {
        	setCategories(response.data);

      		transaction['category_id'] = response.data[0].category_id;
      		setTransaction(transaction);
        }

      } else {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      }
    })
    .catch((error) => {
      showFlashMessage(true, 'error', 'Error on fetching categories. ' + error, null);
    })
	}

	React.useEffect(() => {
		fetchWallets();
		fetchCurrencies();
		fetchCategories();
	}, []);

	return(
		<div>
			<FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

			<h2>Add transaction</h2>

			<div className="line"></div>

			<AlertNotify show={showAlert} message={alertNotifyMessage} />

		 	<div className="form-container">
			 	<div className="row">
					<div className="col-4">
					{ hasWallet ? (
						<form onSubmit={handleSubmit}>
							<div className="form-row">
								<div className="form-group col-md-6 mb-0"></div>
								<div className="form-group col-md-6 mb-0">
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
								  <KeyboardDatePicker
					          disableToolbar
					          variant="inline"
					          format="MM/dd/yyyy"
					          margin="normal"
					          id="date-picker-inline"
					          label="Transaction date"
					          value={selectedDate}
					          onChange={handleDateChange}
					          KeyboardButtonProps={{
					            'aria-label': 'change date',
					          }}
					        />
					      </MuiPickersUtilsProvider>
				      	</div>
				      </div> 	
							<div className="form-group">
								<label htmlFor="wallet_name">Wallet name</label>
								<DynamicDropdown data={wallets} 
									optionKey={'wallet_id'} 
									optionValue={'wallet_name'} 
									onChangeCallback={handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="wallet_name">Category</label>
								<DynamicDropdown data={categories} 
									optionKey={'category_id'} 
									optionValue={'category'} 
									pleaseSelectMessage="Please select category..." 
									onChangeCallback={handleChange} />
							</div>
							<div className="form-row">
								<div className="form-group col-md-6">
									<label htmlFor="amount">Amount</label>
									<input type="text" className="form-control" id="amount" name="amount" 
									placeholder="" onChange={handleChange} />
								</div>
								<div className="form-group col-md-6">
									<label htmlFor="currency_id">Currency</label>
									<DynamicDropdown data={currencyOptions} 
										optionKey={'currency_id'} 
										optionValue={'currency_symbol'} 
										onChangeCallback={handleChange} />
								</div>
							</div>
						  <div className="form-group">
						    <label htmlFor="exampleFormControlTextarea1">Note</label>
						    <textarea className="form-control" id="note" name="note" rows="3" onChange={handleChange}></textarea>
						  </div>
						
							<input type="hidden" name="user_id" value={''}/>
							<div>
								<button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Save</button>
							</div>
						</form>
					) : null }
					</div>
			 	</div>
		 	</div>
		</div>
	 );
}

export default AddTransaction;

