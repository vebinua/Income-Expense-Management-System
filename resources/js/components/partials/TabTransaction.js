import React, { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple, lightGreen, teal, cyan } from '@material-ui/core/colors';
import Moment from 'moment';
import Divider from '@material-ui/core/Divider';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function thousands_separators(num)
{
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
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

const ListItem = withStyles({
  root: {
    "&$selected": {
    },
    "&$selected:hover": {
    },
    "&:hover": {
    }
  },
  selected: {}
})(MuiListItem);

 const RenderTransactions = ({data, callback, activeTab}) => {

  let trans = [];
  let transactionAmountClass = false;
  let transactionAmount = 0;
  let category = '';
  let accountType = '';
  let secondary = '';
  const [selectedIndex, setSelectedIndex] = useState(false);
  const classes = useStyles();

  if (data.length == 0) return null;

  const handleListOnClick = useCallback((a, b) => {
    //console.log('from use callback!' + a + ' ' + b)
    return () => {
      callback(a, b)
    }
  }, []);

  const transactionLists = data.map((transaction) => {
    
    category = transaction.category;
    accountType = transaction.account_type;
    transactionAmount = thousands_separators(formatAmount(transaction.amount));

    console.log(transaction.transaction_type);

    if (transaction.transaction_type == 'new wallet') {
      category = transaction.wallet_name;
      accountType = 'asset';
      secondary = 'New wallet created with initial balance of ' + transactionAmount;
    } else {
      secondary = '';
    }

    return (
    <Fragment key={'fragment-'+transaction.transaction_id}> 
    <ListItem
      button
      selected={selectedIndex === transaction.transaction_id}
      disableRipple
      key={'listItem-'+transaction.transaction_id}
      data-transaction-id={transaction.transaction_id}
      data-wallet-name={transaction.wallet_name}
      onClick={handleListOnClick(transaction.transaction_id, activeTab)}>
      <ListItemIcon>
        <Avatar className={classes.purple}>{category !== null ? category.substring(0,2).toUpperCase() : null}</Avatar>
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
            <span className="transactionCategory">{category !== null ? category : null}</span>
            <span className="transactionDateDetails">{Moment(transaction.transaction_date).format('dddd, MMMM YYYY')}</span>
            <span className="secondary">{secondary}</span>
          </div>
        </React.Fragment>
      }/>

      <span className={'transactionAmount '+ (accountType == 'asset' ? 'amountIncome' : 'amountExpense')}>
      {(accountType == 'asset' ? '+' : '-')}<span>&#8369;</span>
      {transactionAmount} 
      </span>
      <div className="forTransactionDetails" id={'forTransactionDetails-'+transaction.transaction_id}>
        The quick brown fox jumps over the head of the lazy dog
      </div>
    </ListItem>
    <Divider />
    </Fragment>)
  });

  return transactionLists;
}


export default function SimpleTabs({thisMonth, lastMonth, listItemCallback}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  console.log('FROM SIMPLE TABS: ');
  console.log(thisMonth.transactions);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let totalFlowsThisMonth = Number(thisMonth.inflows) - Number(thisMonth.outflows);
  let totalFlowsLastMonth = Number(lastMonth.inflows) - Number(lastMonth.outflows);

  return (
    <div className={classes.root + ' tabTransaction'}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="This Month" {...a11yProps(0)} disableRipple />
          <Tab label="Last Month" {...a11yProps(1)} disableRipple />
          <Tab label="This Year" {...a11yProps(2)} disableRipple />
        </Tabs>
      </AppBar>
      <TabPanel className="tabPanel" key='tab-0' value={value} index={0}>
      <ul className="inflowOutflow">
        <li>Inflow <span className="allInflows">+₱{thousands_separators(thisMonth.inflows)}</span></li>
        <li>Outflow <span className="allOutflows">-{thousands_separators(thisMonth.outflows)}</span></li>
        <li><span className="flowsTotal">₱{thousands_separators(Number.parseFloat(totalFlowsThisMonth).toFixed(2))}</span></li>
      </ul>
      <div className="clear"></div>

      <Paper id="transactionWrapper">
        <List component="nav" aria-label="main mailbox folders">
          <RenderTransactions data={thisMonth.transactions} callback={listItemCallback} activeTab={value}/>
        </List>
      </Paper>

      </TabPanel>
      <TabPanel className="tabPanel" key='tab-1' value={value} index={1}>
      <ul className="inflowOutflow">
        <li>Inflow <span className="allInflows">+₱{thousands_separators(lastMonth.inflows)}</span></li>
        <li>Outflow <span className="allOutflows">-{thousands_separators(lastMonth.outflows)}</span></li>
        <li><span className="flowsTotal">₱{thousands_separators(Number.parseFloat(totalFlowsLastMonth).toFixed(2))}</span></li>
      </ul>
      <div className="clear"></div>

      <Paper id="transactionWrapper">
        <List component="nav" aria-label="main mailbox folders">
          <RenderTransactions data={lastMonth.transactions} callback={listItemCallback} activeTab={value}/>
        </List>
      </Paper>

      </TabPanel>
      <TabPanel className="tabPanel" key='tab-2' value={value} index={2}>
        
      </TabPanel>
    </div>
  );
}