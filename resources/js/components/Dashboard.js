import axios from 'axios';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import NumberFormat from 'react-number-format';
import FadeFlash from './partials/FadeFlash';
import ApiService from './helpers/services/ApiService';
import { HandleLogout } from './helpers/HandleLogout';

import NetWorth from './dashboard/NetWorth';
import MonthlyIncome from './dashboard/MonthlyIncome';
import MonthlyExpense from './dashboard/MonthlyExpense';

const Dashboard = (props) => {

  const loggedUserId = props.loggedUserId;
  const history = useHistory();

  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [totalWalletFunds, setTotalWalletFunds] = useState(0);
  const [totalMonthlyInflows, setTotalMonthlyInflows] = useState(0);
  const [totalMonthlyOutflows, setTotalMonthlyOutflows] = useState(0);
  const [flash, setFlash] = useState(false);
  
  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    if (callback !== null) {

      setTimeout(() => {
        setFlash(false);
        callback();
      }, 3500); 
    }
  }


  function fetchNetWorth() {
    
    axios.all(
      [
        ApiService.getNetWorth(loggedUserId),
        ApiService.getMonthlyIncomeAndExpense(loggedUserId)
      ]
    )
    .then(axios.spread((...responses) => {

      const netWorthResponse = responses[0];
      const monthlyInOutResponse = responses[1];

      if (netWorthResponse.data.isUnauthorized) {
        
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });

      } else {
        let inflows = 0;
        let outflows = 0;
        let sum = netWorthResponse.data[0].sum / 100;
        setTotalWalletFunds(sum);

        if (typeof monthlyInOutResponse.data.transaction.income !== 'undefined') {
          console.log('not undefined!');
          inflows = monthlyInOutResponse.data.transaction.income / 100;
        }

        if (typeof monthlyInOutResponse.data.transaction.expense !== 'undefined') {
          outflows = monthlyInOutResponse.data.transaction.expense / 100;
        }

        setTotalMonthlyInflows(inflows);
        setTotalMonthlyOutflows(outflows);
      }
    }))
    .catch((errors) => {
      showFlashMessage(true, 'error', 'Error on fetching widgets data ' + errors, null);
    })
  }

  React.useEffect(() => {
    fetchNetWorth();
  }, []);

    return (
      <div className="dashboard">
        <FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>
          <Container maxWidth={false} className="dashboard">
            <Grid
              container
              spacing={3}>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}>
               <NetWorth totalWalletFunds={
                <NumberFormat value={totalWalletFunds} displayType={'text'} thousandSeparator={true} prefix={'₱'} fixedDecimalScale={true} decimalScale={2} />
               } />
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
              <MonthlyIncome totalWalletFunds={
                <NumberFormat value={totalMonthlyInflows} displayType={'text'} thousandSeparator={true} prefix={'₱'} fixedDecimalScale={true} decimalScale={2} />
               } />
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
              <MonthlyExpense totalWalletFunds={
                <NumberFormat value={totalMonthlyOutflows} displayType={'text'} thousandSeparator={true} prefix={'₱'} fixedDecimalScale={true} decimalScale={2} />
               } />
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={9}
                xs={12}
              >
               
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
              >
              
              </Grid>
              <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
              >
              
              </Grid>
              <Grid
                item
                lg={8}
                md={12}
                xl={9}
                xs={12}
              >
              
              </Grid>
            </Grid>
          </Container>

        </div>
    )
}

export default Dashboard;
