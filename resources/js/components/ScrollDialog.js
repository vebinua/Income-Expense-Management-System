import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TabCategories from './partials/TabCategories';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [searchCategory, setSearchCategory] = React.useState('');

  console.log('from scroll dialog!');
  console.log(props.assetCategories);
  console.log(props.liabilityCategories);
  
  const handleClickOpen = (scrollType) => () => {
    setSearchCategory('');
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    let value = e.target.value;

    setSearchCategory(value);

    //setIncomeCategories(value);
  }

  const callbackSelectClicked = (categoryId, category) => {
    console.log('category selected is: ' + categoryId + ' category ' + category);
    setOpen(false);
  }

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    console.log('from effect!');
  }, [open]);

  return (
    <div>
      <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button>
      <Dialog
        className="dialogSearchCategories"
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'sm'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
        Select Category
        <Box p={3}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="searchCat"
          label="Search"
          name="searchCat"
          autoComplete="search"
          autoFocus
          onChange={handleChange}
        />
        </Box>
        
        </DialogTitle>
        <TabCategories key="key-tab" assetCategories={props.assetCategories} liabilityCategories={props.liabilityCategories} searchCategory={searchCategory} 
        callbackDialog={callbackSelectClicked}/>
        <DialogContent dividers={scroll === 'paper'}>

          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          </DialogContentText>
        </DialogContent>
        {/*<DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>*/}
      </Dialog>
    </div>
  );
}
