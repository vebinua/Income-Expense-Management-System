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

import ScrollDialog from './ScrollDialog';

 

const Canvas = (props) => {

  let loggedUserId = props.loggedUserId;
  let isServiceValid = false;
  let optionItems = false;
  let history = useHistory();
  
  const [flash, setFlash] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState(null);
  const [assetCategories, setAssetCategories] = useState(null);
  const [liabilityCategories, setLiabilityCategories] = useState(null);
  

  const ladda = useRef(false);
  let timeoutRef = useRef();

  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    timeoutRef = setTimeout(() => {
      setFlash(false);
      callback();
    }, 3500); 
  }

  function fetchCategories() {
    axios.all(
      [
        ApiService.getCategoriesByUserWithType(loggedUserId, 'asset'),
        ApiService.getCategoriesByUserWithType(loggedUserId, 'liability')
      ]
    )
    .then(axios.spread((...responses) => {

      console.log('responses!');

      const assetResponse = responses[0];
      const liabilityResponse = responses[1];

      if (assetResponse.data.isUnauthorized || liabilityResponse.data.isUnauthorized) {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
        window.clearTimeout(timeoutRef);
        history.push({pathname: '/login'});
        })
      } else {

        if (assetResponse.data.length == 0) {
          /*let msg = renderHTML("No wallets found. You must have a wallet to make a transaction. Would you like to <a href='"+window.config.baseUrl+"wallets/add'>add wallet</a> now?");
          setAlertNotifyMessage(msg);
          setShowAlert(true);*/
        } else {
          console.log('asset response');
          console.log(assetResponse.data);

          console.log('liability response');
          console.log(liabilityResponse.data);

          setAssetCategories(assetResponse.data);
          setLiabilityCategories(liabilityResponse.data);
          setShowForm(true);
        }

      }


    }))
    .catch((errors) => {
      showFlashMessage(true, 'error', 'Error on fetching categories ' + errors, null);
    })
  }

  React.useEffect(() => {
    console.log('fetching categories');
    fetchCategories();
  }, []);

  

  return(
      <div>
        
        <h2>Canvas Sandbox</h2>

        {!showForm ? null :
        (<ScrollDialog assetCategories={assetCategories} liabilityCategories={liabilityCategories} />)
        }
      </div>
   );
}

export default Canvas;

