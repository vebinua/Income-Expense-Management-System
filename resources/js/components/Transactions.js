import axios from 'axios';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import * as Ladda from 'ladda';
import 'ladda/dist/ladda-themeless.min.css';

import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import NumberFormat from 'react-number-format';

import FadeFlash from './partials/FadeFlash';
import ApiService from "./helpers/services/ApiService";
import { HandleLogout } from './helpers/HandleLogout';

const handleAlertWarningClick = (e) => {
  e.preventDefault();

  document.querySelector('.alert-warning-default').remove();
}

const styles = {
  alert: {
    left: '0',
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: '1500',
  },
  container: {
    float: 'left'
  },
  root: {
    maxWidth: 345
  },
  media: {
    height: 100,
    width: 100
  }
};

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  progressIndicator: {
    width: '100%'
  },
  progressIndicatorWrapper: {
    marginTop: theme.spacing(3)
  }
}));

const renderRows = (items, key) => {
  return (
    <div className="row mb-4" key={'row-'+key}>
      {items}
    </div>
  );
}

const renderCards = (data, deleteCallback) => {

  function handleDeleteCallback(event) {

    deleteCallback(event.currentTarget.dataset.id);

  }  

  let index = 0;
  let key = 0;
  let walletId = 0;
  let initialBalance = 0;
  let walletName = ''; 
  let card = '';
  var rows = [];
  var items = [];

  for (let i=1; i<=data.length; i++) {
    key = key + 1;
    index = i - 1;
    walletId = data[index].wallet_id;
    walletName = data[index].wallet_name;
    initialBalance = data[index].initial_balance;
    
    items.push(
      <div className="col col-3 card-wallet" id={'card-'+walletId} key={'key-'+key}>
        <Card styles={styles.root}>
        <CardActionArea>
          <CardMedia className="ico-wallet"
            styles={styles.media}
            image={window.config.baseUrl+"images/ico_wallet.svg"}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {walletName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <NumberFormat value={initialBalance} displayType={'text'} thousandSeparator={true} prefix={'₱'} fixedDecimalScale={true} decimalScale={2} />
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Edit
          </Button>
          <Button size="small" color="secondary" data-id={walletId}
          onClick={handleDeleteCallback}>
            Delete
          </Button>
        </CardActions>
        <div className="aiWrapper">
          <CircularProgress color="secondary" />
        </div>
        </Card>
      </div>
    );
    
    if (i % 4 == 0) {
      rows.push(renderRows(items, key));
      items = [];
    } else if (i == data.length) {
      //add empty placeholder for spaces
      console.log(items.length);
      rows.push(renderRows(items, key));
    }    
  }

  return rows;
}

export function AlertDialog({isOpen, itemId, onAlertConfirm, onAlertCancel}) {
  
  function handleAlertConfirm(event) {
    let action = event.currentTarget.dataset.action;
    let itemId = event.currentTarget.dataset.id;

    onAlertConfirm(itemId, action); 
  }

  function handleAlertClose(event) {
    onAlertCancel();
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Wallet"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the selected wallet? All transactions with this wallet will be deleted as well.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} data-action="cancel" color="primary">
            Cancel
          </Button>
          <Button onClick={handleAlertConfirm} data-action="confirm" data-id={itemId} color="primary" autoFocus>
            Yes, Delete wallet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


const Transactions = (props) => {
  const classes = useStyles();

  let loggedUserId = props.loggedUserId;
  let isServiceValid = false;
  let history = useHistory();

  const [myWallets, setMyWallets] = useState('');
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [flash, setFlash] = useState(false);
  const [alert, setAlert] = React.useState(false);
  const [showProgressIndicator, setShowProgressIndicator] = React.useState(true);  
  const [itemId, setItemId] = React.useState(0);
  

  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    setTimeout(() => {
      setFlash(false);
      callback();
    }, 3500); 
  }

  function handleAlertCancel() {
    setAlert(false);
  }

  function handleAlertConfirm(itemId, action) {
    setAlert(false);

    if (action == 'confirm') {

      document.querySelector("#card-"+itemId+" .aiWrapper").style.display = 'block';
      document.querySelector("#card-"+itemId+" .MuiButtonBase-root").style.opacity = '.25';

      ApiService.deleteWallet(itemId, loggedUserId)
      .then(response => {
      
        isServiceValid = ApiService.validateServiceResponse(response);
      
        if (isServiceValid) {
          document.querySelector("#card-"+itemId+" .aiWrapper").style.display = 'none';
          document.querySelector("#card-"+itemId+" .MuiButtonBase-root").style.opacity = '1';
          fetchWallets();
        } else {
          showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
            HandleLogout();
            history.push({pathname: '/login'});
          });
        }
      })
      .catch((error) => {
        showFlashMessage(true, 'error', 'Error on deleting wallets. ' + error, null);
      })
    }
    
    console.log('from handle child click item id: ' + itemId + ' action: ' + action);
  }

  function fetchWallets() {

    ApiService.getWalletsByUser(loggedUserId)
    .then(response => {
      
      isServiceValid = ApiService.validateServiceResponse(response);
      
      if (isServiceValid) {
        setMyWallets(renderCards(response.data, (itemId, action) => {
          setAlert(true);
          setItemId(itemId);
        }));

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

  React.useEffect(() => {
    fetchWallets();
  }, []);

  return(
    <div>
      <FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

      <div className="row">
        <div className="col">
          <h2>Transactions</h2>
        </div>
        <div className="col" align="right">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
            href={window.config.baseUrl+'transactions/add'}
            >
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="line"></div>

      <div className="alert alert-warning alert-warning-default" role="alert">
        <button type="button" className="close-alert" onClick={handleAlertWarningClick}>×</button>
        No transactions found. <Link to="/transactions/add">Add transaction</Link> now?
      </div>

      <div className="container" key="key-container" style={styles.container}>
        {myWallets}
        <AlertDialog  onAlertCancel={handleAlertCancel} onAlertConfirm={handleAlertConfirm} isOpen={alert} itemId={itemId} />
      </div>
    </div>
  );
}

export default Transactions;