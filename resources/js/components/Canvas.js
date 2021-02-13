import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';

import * as Ladda from 'ladda';

import 'ladda/dist/ladda-themeless.min.css';

import FadeFlash from './partials/FadeFlash';
import ApiService from "./helpers/services/ApiService";
import DynamicDropdown from './helpers/DynamicDropdown';
import { HandleLogout } from './helpers/HandleLogout';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import ScrollDialogCategoryWithSub from './ScrollDialogCategoryWithSub';


const useStyles = makeStyles((theme) => ({
  progressIndicator: {
    width: '100%',
    backgroundColor: '#17a2b8',
    background: '#17a2b8'
  },
  progressIndicatorWrapper: {
    marginTop: theme.spacing(0),
  }
}));

const Canvas = (props) => {
  const classes = useStyles();

  let loggedUserId = props.loggedUserId;
  let isServiceValid = false;
  let optionItems = false;
  let history = useHistory();
  
  const [flash, setFlash] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [showProgressIndicator, setShowProgressIndicator] = useState(true);  

  const [categories, setCategories] = useState(null);
  const [assetCategories, setAssetCategories] = useState(null);
  const [liabilityCategories, setLiabilityCategories] = useState(null);
  const [categoryId, setCategoryId] = useState(0);
  const [subcategory, setSubcategory] = useState(''); 
  
  const ladda = useRef(false);
  let timeoutRef = useRef(false);

  let scrollDialogCallback = (prop) => {
    setCategoryId(prop.categoryId);
  }

  let handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      'subcategory': subcategory,
      'category_id': categoryId
    };

    ladda.current.start();

    ApiService.postSubcategory(data)
      .then(response => {
      
      if (response.data.isUnauthorized) {
          showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
        setSubcategory('');
        showFlashMessage(true, 'success', 'Subcategory has been successfully added.', ()=> {
        });
      }

      ladda.current.stop();
    })
    .catch((error) => {
      showFlashMessage(true, 'error', 'Error on saving subcategory. ' + error);
      ladda.current.stop();
    })
  }   

  let handleSelectCategoryClick = (e) => {
    e.preventDefault();

    alert('show dialog here');

    return false;
  }

  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    timeoutRef = setTimeout(() => {
      setFlash(false);
      if (callback !== null) callback();
    }, 3500); 
  }

  
  function fetchCategories() {
    axios.all(
      [
        ApiService.getCategoriesWithSub(loggedUserId, 'asset'),
        ApiService.getCategoriesWithSub(loggedUserId, 'liability')
      ]
    )
    .then(axios.spread((...responses) => {

      console.log('responses!');

      const assetResponse = responses[0];
      const liabilityResponse = responses[1];
      
      if (assetResponse.data.isUnauthorized || assetResponse.data.isUnauthorized) {
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
        window.clearTimeout(timeoutRef);
        history.push({pathname: '/login'});
        })
      } else {

          console.log('categories with sub');
          console.log(assetResponse.data);
        

        if (assetResponse.data.length == 0) {
          /*let msg = renderHTML("No wallets found. You must have a wallet to make a transaction. Would you like to <a href='"+window.config.baseUrl+"wallets/add'>add wallet</a> now?");
          setAlertNotifyMessage(msg);
          setShowAlert(true);*/
        } else {
          console.log(assetResponse);

          setAssetCategories(assetResponse.data);
          setLiabilityCategories(liabilityResponse.data);
          setShowProgressIndicator(false);
          setShowForm(true);
        }

      }


    }))
    .catch((errors) => {
      showFlashMessage(true, 'error', 'Error on fetching categories ' + errors, null);
    })
  }


  useEffect(() => {
    fetchCategories();
  }, []);

  return(
      <div>
        
        <FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

        <h2>Add subcategory</h2>

        <div className="line"></div>

        <div className="form-container">

           <div className="row">
               <div className="col-md-12 col-xs-12 col-lg-3">
                <div className={classes.progressIndicatorWrapper}>
                  { showProgressIndicator ?
                  <div className={classes.progressIndicator}>
                    <LinearProgress className="progressIndicator" />
                  </div>
                  :  <Box pt={.5}></Box> }
                </div>
                
                {!showForm ? null :
                      
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group col-lg-12">
                          <label htmlFor="selectCategory">Category</label>
                          <ScrollDialogCategoryWithSub assetCategories={assetCategories} liabilityCategories={liabilityCategories} scrollDialogCallback={scrollDialogCallback} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label htmlFor="subcategory">Subcategory name</label>
                        <input type="text" className="form-control" id="subcategory" name="subcategory" 
                        placeholder="" onChange={(e)=> {setSubcategory(e.target.value)}} value={subcategory} />
                      </div>
                    </div>

                    <div>
                      <button type="submit" className="btn btn-info btn-submit ladda-button" data-style="expand-left">Save</button>
                    </div>
                  </form>
                }
               </div>
           </div>
         </div>
      </div>
   );
}

export default Canvas;

