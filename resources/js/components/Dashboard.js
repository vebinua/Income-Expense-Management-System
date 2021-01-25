import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import NumberFormat from 'react-number-format';
import NetWorth from './dashboard/NetWorth';
import FadeFlash from './partials/FadeFlash';
import ApiService from './helpers/services/ApiService';

import { HandleLogout } from './helpers/HandleLogout';

/*import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';*/

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = (props) => {

  const loggedUserId = props.loggedUserId;
  const history = useHistory();

  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [totalWalletFunds, setTotalWalletFunds] = useState(0);
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
    
    
    ApiService.getNetWorth(loggedUserId)
    .then(response => {

      if (response.data.isUnauthorized) {
        
        showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });

      } else {
        let sum = response.data[0].sum / 100;
        setTotalWalletFunds(sum);
      }
    })
    .catch((error) => {
      showFlashMessage(true, 'error', 'Error on fetching net worth. ' + error, null);
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
              abcde
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
               abcde
              </Grid>
              <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
              abcde
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
