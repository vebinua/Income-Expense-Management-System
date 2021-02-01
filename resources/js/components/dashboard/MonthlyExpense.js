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
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: '#e51c23',
    height: 56,
    width: 56
  },
  h3: {
    color: '#e51c23'
  }
}));

const MonthlyExpense = ({ className, totalWalletFunds, ...rest }) => {
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
            <h6>MONTHLY OUTFLOWS</h6>
            <h3 className={classes.h3}>-{totalWalletFunds}</h3>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <RemoveIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

MonthlyExpense.propTypes = {
  className: PropTypes.string
};

export default MonthlyExpense;