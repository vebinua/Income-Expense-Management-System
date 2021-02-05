import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter, Switch, useHistory, Redirect } from 'react-router-dom';
import React, { useEffect, useState, useRef, Fragment } from 'react';

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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import { HandleLogout } from './helpers/HandleLogout';

import FadeFlash from './partials/FadeFlash';
import ApiService from './helpers/services/ApiService';

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 650,
	},
	button: {
		margin: theme.spacing(1),
	},
	 paper: {
		width: "100%",
		marginBottom: theme.spacing(2)
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
	},
	progressIndicator: {
		width: '100%',
	},
	progressIndicatorWrapper: {
		marginTop: theme.spacing(3),
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

export function AlertDialog(props) {
	
	return (
		<div>
			<Dialog
				open={props.isOpen}
				onClose={props.onAlertClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete the selected category?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={(e)=> props.onAlertClose(e, 'cancel')} data-action="cancel" color="primary">
						Cancel
					</Button>
					<Button onClick={(e)=> props.onAlertClose(e, 'confirm')} data-action="confirm" color="primary" autoFocus>
						Delete category
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const EnhancedCategories = ({ rows, handler, showProgressIndicator }) => {

	const classes = useStyles();

	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("category");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [open, setOpen] = React.useState(false);
	const [itemId, setItemId] = React.useState(0);
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [deletedRows, setDeletedRows] = React.useState([]);
	const [items, setItems] = React.useState(rows);
	const [flash, setFlash] = React.useState(false);
	const [severity, setSeverity] = React.useState("success");
	const [flashMessage, setFlashMessage] = React.useState("");

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

	const handleClickAlertDeleteOpen = (e, cateogryId, index) => {
		setOpen(true);
		setItemId(cateogryId);
		setSelectedRows(index);
	};
	
	const handleClickAlertDeleteClose = (e, action) => {

		if (action == 'cancel') {
			//do nothing?
		} else if (action == 'confirm') {
			
			let props = {
				'action': 'delete_category',
				'categoryId': itemId
			}
			handler(props);
	}
		setOpen(false);
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

	const Spacer = require('react-spacer');

	const deleteItem= (i, category_id) => {
		console.log('from deleteItem! ');
		const filteredArray = items.filter((res) => res.category_id !== category_id);

		setItems(filteredArray);
	}

	React.useEffect(() => {
		setItems(rows);
	}, [rows]);
	
	return ( 
			<div className={classes.root}>
				<div className={classes.progressIndicatorWrapper}>
					{ showProgressIndicator ?
					<div className={classes.progressIndicator}>
						<LinearProgress color="secondary" className="progressIndicator" />
					</div>
					:  <Box pt={.5}></Box> }
				</div>
			
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table + ' table-listings'}
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
							rowCount={items.length}
						/>
						<TableBody>
							{stableSort(items, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.category_id);
									
									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.category_id, true)} 
											tabIndex={-1}
											key={`row-${index}`}
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
													href={window.config.baseUrl+"category/"+row.category_id+"/edit"}
													>
												Edit
												</Button>
												 <Button
													id={row.category_id}
													onClick={(event) => handleClickAlertDeleteOpen(event, row.category_id, index)}
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
					count={items.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			

			<AlertDialog onAlertOpen={handleClickAlertDeleteOpen} onAlertClose={handleClickAlertDeleteClose} isOpen={open} itemId={itemId} />
	
		</div>
	);
}

const styles = {
	alert: {
		left: '0',
		pointerEvents: 'none',
		position: 'fixed',
		top: 0,
		width: '100%',
		zIndex: '1500',
	}
};


const Categories = (props) => {

	let loggedUserId = props.loggedUserId;
	let isServiceValid = false;
	let history = useHistory();
	
	const [flash, setFlash] = useState(false);
	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [severity, setSeverity] = useState('success');
	const [flashMessage, setFlashMessage] = useState('');
	const [categoryName, setCategoryName] = useState('');
	const [showProgressIndicator, setShowProgressIndicator] = useState(false);
	
	const ladda = useRef(false);

	const [categories, setCategories] = useState([]);

	let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    setTimeout(() => {
      setFlash(false);
      callback();
    }, 3500); 
  }

 	let handler = (prop) => {
		
 		if (prop.action == 'delete_category') {
 			setShowProgressIndicator(true);

 			deleteCategory(prop.categoryId);
 			
 			return false;
 		}
 	}

	let updateCategoryList = (category_id) => {
		console.log('from deleteItem! ');
		const filteredArray = categories.filter((res) => res.category_id !== category_id);

		setCategories(filteredArray);
	}

	let deleteCategory = (categoryId) => {

	 	ApiService.deleteCategory(categoryId, loggedUserId)
    .then(response => {
    
      if (response.data.isUnauthorized) {
          showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
      	updateCategoryList(categoryId);
      	showFlashMessage(true, 'success', response.data.message, ()=> {
      	});    
    		setShowProgressIndicator(false);
			}

    })
 		.catch((error) => {
 			showFlashMessage(true, 'error', 'Error on deleting category: ' + error, null);
  	});
 	}

	React.useEffect(() => {
		
		 ApiService.getCategories(loggedUserId)
      .then(response => {
      
      if (response.data.isUnauthorized) {
          showFlashMessage(true, 'error', 'Your session may have already expired, please login again.', ()=> {
          HandleLogout();
          history.push({pathname: '/login'});
        });
      } else {
      	setCategories(response.data);
      }

    })
   	.catch((error) => {
   		showFlashMessage(true, 'error', 'Error on fetching categories: ' + error, null);
    });

	}, []);


	return (
		<div>
			
			<FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

			<h2>Category Listings</h2>
			
			<div className="line"></div>

			<EnhancedCategories rows={categories} handler={handler} showProgressIndicator={showProgressIndicator} />
		 
		</div>
	)	
}


export default Categories;