import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import { Icon, InlineIcon } from '@iconify/react';
import currencyPhp from '@iconify-icons/mdi/currency-php';
import AddIcon from '@material-ui/icons/Add';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';


const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: '#039be5',
    height: 56,
    width: 56
  },
  h3: {
    color: '#039be5'
  }
}));

const MonthlyIncome = ({ className, totalWalletFunds, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <h6>MONTHLY INFLOWS</h6>
            <h3 className={classes.h3}>+{totalWalletFunds}</h3>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AddIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

MonthlyIncome.propTypes = {
  className: PropTypes.string
};

export default MonthlyIncome;