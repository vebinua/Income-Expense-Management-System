import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let total = Number(props.inflows) - Number(props.outflows);

  return (
    <div className={classes.root + ' tabTransaction'}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="This Month" {...a11yProps(0)} disableRipple />
          <Tab label="Last Month" {...a11yProps(1)} disableRipple />
          <Tab label="This Year" {...a11yProps(2)} disableRipple />
        </Tabs>
      </AppBar>
      <TabPanel key='tab-0' value={value} index={0}>
      <ul className="inflowOutflow">
        <li>Inflow <span className="allInflows">+₱{thousands_separators(props.inflows)}</span></li>
        <li>Outflow <span className="allOutflows">-{thousands_separators(props.outflows)}</span></li>
        <li><span className="flowsTotal">₱{thousands_separators(Number.parseFloat(total).toFixed(2))}</span></li>
      </ul>
      <div className="clear"></div>
      </TabPanel>
      <TabPanel key='tab-1' value={value} index={1}>

      </TabPanel>
      <TabPanel key='tab-2' value={value} index={2}>

      </TabPanel>
    </div>
  );
}