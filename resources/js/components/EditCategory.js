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

const EditCategory = (props) => {

	let loggedUserId = props.loggedUserId;
	let isServiceValid = false;
	let optionItems = false;
	let history = useHistory();
	
	const [flash, setFlash] = useState(false);
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [flashMessage, setFlashMessage] = useState('');
	const [categoryName, setCategoryName] = useState('');
	const [accountType, setAccountType] = useState('asset');
  const [parentId, setParentId] = useState(0);
	const ladda = useRef(false);
  const [isLoading, setIsLoading] = useState(true);


  let clearFields = () => {
    document.getElementById('frmAddCategory').reset();
    setAccountType('asset');
  }

	let handleSubmit = (e) => {
		e.preventDefault();

		const data = {
      'category': categoryName,
      'account_type': accountType,
      'user_id': loggedUserId,
      'parent_id': parentId
    };

		ladda.current.start();

	  ApiService.putCategory(data, props.match.params.id)
      .then(response => {
      
      if (response.data.isUnauthorized) {
          showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
        clearFields();
        showFlashMessage(true, 'success', 'Category has been successfully updated.', ()=> {
        });
      }

      ladda.current.stop();
    })
	}   

	let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    setTimeout(() => {
      setFlash(false);
      if (callback !== null) callback();
    }, 3500); 
  }

	React.useEffect(() => {
		ladda.current = Ladda.create(document.querySelector('.btn-submit'));

    ApiService.getUserCategory(props.match.params.id, loggedUserId)
    .then(response => {
      
      if (response.data.isUnauthorized) {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
        
        setCategoryName(response.data.category);
        setAccountType(response.data.account_type);
        setParentId(response.data.parent_id);

        setIsLoading(false);
      }

      ladda.current.stop();
    })
    .catch((error) => {
      showFlashMessage(true, 'error', 'Error on fetching category. ' + error);
      ladda.current.stop();
    });

	}, []);

	return(
			<div>
				<FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

				<h2>Edit category</h2>

				<div className="line"></div>

				 <div className="form-container">
					 <div className="row">
							 	<div className="col-4">

								<form id="frmAddCategory" onSubmit={handleSubmit} className={isLoading ? "hide-form" : ""}>
	            
	                <div className="form-group">
	                  <label htmlFor="category">Category</label>
	                  <input type="text" className="form-control" id="category" name="category" placeholder="Category" 
	                  onChange={(e)=> {setCategoryName(e.target.value)}} value={categoryName}  />
	                </div>

	                <div className="form-group">
	                  <label>Account Type</label>
	                  <div className="custom-control custom-radio">
	                      <input type="radio" id="asset" name="account_type" value={accountType} className="custom-control-input" defaultChecked/>
	                      <label className="custom-control-label" htmlFor="asset">{accountType == 'asset' ? 'Asset' : 'Liability'}</label>
	                  </div>
	                </div>

                  <button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Update Category</button>
	              </form>

							 	</div>
					 </div>
				 </div>
			</div>
	 );
}

export default EditCategory;

