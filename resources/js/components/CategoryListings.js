import axios from 'axios';
import React from 'react';
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import deepCopy from "./deepCopy";
//import CategoryListingsTable from './tables/CategoryListingsTable';

export const axiosInstance = axios.create({
  baseURL: 'http://www.testing.local/iems/Income-Expense-Management-System',
  //timeout: 1000
});

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
   paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

/*sorting functions*/
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
/**/

/*custom table sections*/
const headCells = [
  { id: "category", numeric: false, disablePadding: false, label: "Category", disableSort: false },
  { id: "account_type", numeric: true, disablePadding: false, label: "Account Type", disableSort: false },
  { id: "actions", numeric: true, disablePadding: false, label: "Actions", disableSort: true }  
];

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
          { headCell.disableSort 
          ?
            <span>{headCell.label}</span>
            : 
            [<TableSortLabel
              key={index}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>]
          }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};
/**/


/*const Categories = ({ categories }) => {
   const classes = useStyles();

   return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Account Type</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.category_id}>
              <TableCell component="th" scope="row">
                {category.category}
              </TableCell>
              <TableCell align="right">{category.account_type}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<EditIcon />}
                  >
                  Edit
                </Button>
                 <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}*/


const EnhancedCategories = ({ rows }) => {
  const classes = useStyles();

  //const [rows] = React.useState("categories");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, disabled) => {
    if (disabled) return false;

    const selectedIndex = selected.indexOf(name);

    console.log(selectedIndex);
    console.log(name);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return ( 
      <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.category_id);
                  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.category_id, true)} 
                      tabIndex={-1}
                      key={row.category_id}
                      id={index}
                    >
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">{row.account_type}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          >
                          Edit
                        </Button>
                         <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}


class CategoryListings extends React.Component {

  constructor () {
    super()
    this.state = {
      categories: []
    }

    
  }

  componentDidMount () {
    axiosInstance.get('/api/categories').then(response => {
      this.setState({
        categories: response.data
      })
    })
  }

  render() {

    const { categories } = this.state;
    


    return (
       <div>
        
            <h2>Category Listings</h2>
            
             {<EnhancedCategories rows={categories} />}

            {/*<Categories categories={categories} />*/}
        </div>
    )
  }
}
export default CategoryListings;
