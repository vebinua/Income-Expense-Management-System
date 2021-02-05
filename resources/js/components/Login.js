import React, { Fragment,useEffect,useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

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
import ApiService from './helpers/services/ApiService';

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
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(1),
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

const Login = (props) => {
  const classes = useStyles();

  const [showProgressIndicator, setShowProgressIndicator] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [flash, setFlash] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [flashMessage, setFlashMessage] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const [username, setUsername] = useState('');


  let isLogged = props.isLogged;
  let loggedUserId = props.loggedUserId;

  let history = useHistory(); 

  let [account, setAccount] = useState({
    email_address: '',
    password: ''
  });

  let showFlashMessage = (show, severity, flashMessage, callback) => {
    setFlash(show);
    setSeverity(severity);
    setFlashMessage(flashMessage);

    setTimeout(() => {
      setFlash(false);
      if (callback !== null) callback();
    }, 3500); 
  }

  let handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    account[name] = value;
    setAccount(account);

    account[name] != '' ? setErrorEmail(false) : '';
    //account['password'] != '' ? setErrorPassword(false) : '';*/
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (account['email_address'] == '') {
      showFlashMessage(true, 'error', 'Username and password fields are both required. Please try again.', null);
      setErrorEmail(true);

      return false;
    } else {
      setErrorEmail(false);
    } 

    if (account['password'] == '') {
      showFlashMessage(true, 'error', 'Username and password fields are both required. Please try again.', null);
      setErrorPassword(true);
      
      return false;
    } else {
      setErrorPassword(false);
    }

    setShowProgressIndicator(true);

    ApiService.postUser(account)
    .then(function (response) {

      if (response.data.access_token && response.data.expires_in){
        let access_token = response.data.access_token;
        let expires_in = response.data.expires_in;
        let user_id = response.data.user.user_id;
        let first_name = response.data.user.first_name;
        let user = response.data.user;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("expires_in", expires_in);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("user", user);
        
        history.push({pathname: '/'});
      
      } else {
        showFlashMessage(true, 'error', 'Invalid username or password. Please try again.', null);
      }
    })
    .catch(function (error) {
        setShowProgressIndicator(false);

        showFlashMessage(true, 'error', 'Invalid username or password. Please try again.', null);
    
        console.log(error);
    });

    return false;
  }

  return (
    <div>
      
      <div className={classes.progressIndicatorWrapper}>
        { showProgressIndicator ?
        <div className={classes.progressIndicator}>
          <LinearProgress color="secondary" className="progressIndicator" />
        </div>
        :  <Box pt={.5}></Box> }
      </div>

      <FadeFlash isFlash={flash} severity={severity} message={flashMessage}/>

      <Container component="main" maxWidth="xs" className="signin-wrapper">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email_address"
              label="Email Address"
              name="email_address"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              helperText=""
              error={errorEmail}
            />
            <TextField
              variant="outlined"
              margin="normal"
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
            {/*<FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              disableRipple
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/*<Link href="#" variant="body2">
                  Forgot password?
                </Link>*/}
              </Grid>
              <Grid item>
                <Link href={window.config.baseUrl+"signup"} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}

export default Login;