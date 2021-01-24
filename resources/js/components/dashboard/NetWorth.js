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


const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const NetWorth = ({ className, ...rest }) => {
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
            <h6>NET WORTH</h6>
            <h3>₱23,200</h3>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <Icon icon={currencyPhp} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

NetWorth.propTypes = {
  className: PropTypes.string
};

export default NetWorth;