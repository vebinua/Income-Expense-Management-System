import axios from 'axios';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';
import renderHTML from 'react-render-html';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Paper from '@material-ui/core/Paper'
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, lightGreen, teal, cyan } from '@material-ui/core/colors';

import AlertNotify from './partials/AlertNotify';
import FadeFlash from './partials/FadeFlash';
import ApiService from "./helpers/services/ApiService";
import { HandleLogout } from './helpers/HandleLogout';
import Moment from 'moment';

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
    float: 'left',
    maxWidth: '100%'
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
  },
  root: {
    width: '100%'
  },
  listItemText:{
    fontSize:'1.5rem',//Insert your required size
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  lightGreen: {
    color: theme.palette.getContrastText(lightGreen[500]),
    backgroundColor: lightGreen[500],
  },
  teal: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
  cyan: {
    color: theme.palette.getContrastText(cyan[500]),
    backgroundColor: cyan[500],
  }
}));

const Transactions = (props) => {
  const classes = useStyles();

  let loggedUserId = props.loggedUserId;
  let isServiceValid = false;
  let history = useHistory();

  const [myTransactions, setMyTransactions] = useState('');
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [flash, setFlash] = useState(false);
  const [alert, setAlert] = React.useState(false);
  const [showProgressIndicator, setShowProgressIndicator] = React.useState(true);  
  const [itemId, setItemId] = React.useState(0);
  const [alertNotifyMessage, setAlertNotifyMessage] = useState('');
  const [showNotify, setShowNotify] = useState(false);
  
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
        //setItemId(itemId);
       
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

  function formatAmount(amount) {
    let res = false;
    let amountString = String(amount/100);
    
    res = amountString.split('.');

    if (res.length == 1) {
      //append 0
      amountString += '.00';
    }

    return amountString;
  }

  const renderTransactions = (data) => {

    let trans = [];
    let transactionAmountClass = false;
    let transactionAmount = 0;

    const transactionLists = data.map(transaction =>
      <Fragment key={'fragment-'+transaction.transaction_id}> 
      <ListItem
        button
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}
        disableRipple
        key={'listItem-'+transaction.transaction_id}
        data-transaction-id={transaction.transaction_id}
      >
        <ListItemIcon>
          <Avatar className={classes.purple}>NA</Avatar>
        </ListItemIcon>
        <ListItemText className={classes.listItemText} primary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              className="transactionDate"
              color="textPrimary"
            >
            {Moment(transaction.transaction_date).format('DD')}
            </Typography>
            <div className="transactionData" key={'transactionData-'+transaction.transaction_id}>
              <span className="transactionCategory">{transaction.category}</span>
              <span className="transactionDateDetails">{Moment(transaction.transaction_date).format('dddd, MMMM YYYY')}</span>
            </div>
          </React.Fragment>
        } />

        <span className={'transactionAmount '+ (transaction.account_type == 'asset' ? 'amountIncome' : 'amountExpense')}>
        {(transaction.account_type == 'asset' ? '+' : '-')}<span>&#8369;</span>
        {formatAmount(transaction.amount)} 
        </span>
      </ListItem>
      <Divider />
      </Fragment>
    )

    return transactionLists;
  }


  function fetchTransaction() {

    ApiService.getTransactionsByUser(loggedUserId)
    .then(response => {
      
      isServiceValid = ApiService.validateServiceResponse(response);
      
      if (isServiceValid) {
        //setItemId(itemId);
        console.log(response.data);
        setMyTransactions(renderTransactions(response.data));
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
    fetchTransaction();
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setChecked(true);
  };

  let classNameHolder = [classes.orange, classes.purple, classes.lightGreen, classes.teal, classes.cyan];

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

      <AlertNotify show={showNotify} message={alertNotifyMessage} />
        
      <div className="container" key="key-container" style={styles.container}>
        <div className={classes.root}>
          
          <Grid container spacing={3}>
            <Grid item xs={5}>
            <Paper>
              <List component="nav" aria-label="main mailbox folders">
                {myTransactions}  
              </List>
            </Paper>
            </Grid>
            <Grid item xs={7}>
              <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <Paper className="foo">xs=6</Paper>
              </Slide>
            </Grid>
          </Grid>

        </div>
      </div>
    </div>
  );
}

export default Transactions;