import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';


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

/*const handleListItemClick = (event, index, callback) => {
    console.log('category id is: ' + index);
    callback;
  };*/

const RenderCategoryLists = ({data, callback}) => {

  console.log('from render!');
  //console.log(data.data.categories.length);
  console.log(data);
  
  const categoryLists = (data || []).map((cat) => {

    return (
       <ListItem
        button
        //selected={selectedIndex === transaction.transaction_id}
        onClick={(event) => callback(cat.category_id, cat.category)}
        disableRipple
        key={'listItem-'+cat.category_id}
        data-category-id={cat.category_id}
      >
      {cat.category}<Divider /></ListItem>);

  });

  const lists = (<List component="nav" aria-label="main mailbox folders">{categoryLists}</List>);
  
  return lists;            
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
  const [assetCategories, setAssetCategories] = React.useState(props.assetCategories);
  const [liabilityCategories, setLiabilityCategories] = React.useState(props.liabilityCategories);
  const [activeCategory, setActiveCategory] = React.useState('asset');
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == 0) {
      setActiveCategory('asset');
    } else {
      setActiveCategory('liability');
    }
  };


   React.useEffect(() => {
    
    let matches = false;
    let searchVal = props.searchCategory.toLowerCase();
    /*let matches = categories.categories.filter(item => {
      console.log(item);
    });*/
    console.log('from handle change: ');
    console.log(props.assetCategories);


    if (activeCategory == 'asset') {
      matches = props.assetCategories.filter(v => v.category.toLowerCase().includes(searchVal));
    } else {
      matches = props.liabilityCategories.filter(v => v.category.toLowerCase().includes(searchVal));
    }
    
    //let matches = categories.filter(v => console.log(v));

    console.log('use effect from tab!');
    console.log(props.assetCategories.categories);
    console.log('matches');
    console.log(matches);

    if (props.searchCategory == '') {
      setAssetCategories(props.assetCategories);
      setLiabilityCategories(props.liabilityCategories);
    } else {
      if (activeCategory == 'asset') {
        setAssetCategories(matches);
      } else {
        setLiabilityCategories(matches);
      }
    }
    
  }, [props.searchCategory]);

  return (
    <div className={classes.root + ' tabCategories tabGeneric'}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Income" {...a11yProps(0)} disableRipple />
          <Tab label="Expense" {...a11yProps(1)} disableRipple />
        </Tabs>
      </AppBar>
      <TabPanel key='tab-0' value={value} index={0}>
      <div className="categoryIncome">
        <RenderCategoryLists data={assetCategories} callback={props.callbackDialog}/>
      </div>    

      <div className="clear"></div>
      </TabPanel>
      <TabPanel key='tab-1' value={value} index={1}>
      <div className="categoryIncome">
        <RenderCategoryLists data={liabilityCategories} callback={props.callbackDialog}/>
      </div>    

      <div className="clear"></div>
      </TabPanel>
      <TabPanel key='tab-2' value={value} index={2}>

      </TabPanel>
    </div>
  );
}