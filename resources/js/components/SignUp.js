import axios from 'axios';
import React, { Fragment,useEffect,useState } from 'react';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import FadeFlash from './partials/FadeFlash';


export const axiosInstance = axios.create({
  baseURL: window.config.baseUrl
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Income and Expense Management System
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progressIndicator: {
    width: '100%',
  },
  progressIndicatorWrapper: {
    marginTop: theme.spacing(0),
  }
}));



const SignUp = () => {

    const classes = useStyles();
    const [showProgressIndicator, setShowProgressIndicator] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [flash, setFlash] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [flashMessage, setFlashMessage] = useState('');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    
    let [account, setAccount] = useState({
      first_name: '',
      last_name: '',
      email_address: '',
      password: ''
    });

    let handleChange = (e) => {
      let name = e.target.name;
      let value = e.target.value;

      account[name] = value;
      setAccount(account);

      if (value == '') {
        if (name == 'first_name') setErrorFirstName(true);
        if (name == 'last_name') setErrorLastName(true);
        if (name == 'email_address') setErrorEmail(true);
        if (name == 'password') setErrorPassword(true);
      } else  {
        if (name == 'first_name') setErrorFirstName(false);
        if (name == 'last_name') setErrorLastName(false);
        if (name == 'email_address') setErrorEmail(false);
        if (name == 'password') setErrorPassword(false);
      }
    }

    let showFlashMessage = (show, severity, flashMessage, callback) => {
      setFlash(show);
      setSeverity(severity);
      setFlashMessage(flashMessage);

      setTimeout(() => {
        setFlash(false);
        if (callback !== null) callback();
      }, 3500); 
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      let hasError = false;

      //basic validation
      if (account['first_name'] == '') {
        showFlashMessage(true, 'error', 'First name is a required field.', null);
        setErrorFirstName(true);
        return false;
      }

      if (account['last_name'] == '') {
        showFlashMessage(true, 'error', 'Last name is a required field.', null);
        setErrorLastName(true);
        return false;
      }

      if (account['email_address'] == '') {
        showFlashMessage(true, 'error', 'Email address is a required field.', null);
        setErrorEmail(true);
        return false;
      }

      if (account['password'] == '') {
        showFlashMessage(true, 'error', 'Password is a required field.', null);
        setErrorPassword(true);
        return false;
      }
      
      setShowProgressIndicator(true);

      axiosInstance.post('/api/users', {account}, {
        data: null,
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
      .then(function (response) {

        if (response.data.status == 'success') {
          setRedirect(true);
        }
      })
      .catch(function (error) {
          console.log(error);
      });

      return false;
    }
    
    return (

      <div>
      {redirect ? (
        <Fragment>
          <Redirect to='/thank-you' />  
        </Fragment>
       ): null }

      
      <div className={classes.progressIndicatorWrapper}>
        { showProgressIndicator ?
        <div className={classes.progressIndicator}>
          <LinearProgress color="secondary" className="progressIndicator" />
        </div>
        :  <Box pt={.5}></Box> }
      </div>

      <FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="first_name"
                  variant="outlined"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                  error={errorFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="lname"
                  onChange={handleChange}
                  error={errorLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email_address"
                  label="Email Address"
                  name="email_address"
                  autoComplete="email"
                  onChange={handleChange}
                  error={errorEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  error={errorPassword}
                />
              </Grid>
              <Grid item xs={12}>
                {/*<FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />*/}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              disableRipple
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href={window.config.baseUrl+"login"} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container></div>
    )
}

export default SignUp;