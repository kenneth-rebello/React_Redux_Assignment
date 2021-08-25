import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Link } from "react-router-dom";
import { login } from '../../redux/actions/authActions';
import { connect } from "react-redux";
import { setError, unsetError } from "../../redux/actions/errorActions";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "90vh"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({authCompleted, login, setError, unsetError}) => {
  const classes = useStyles();

  const email = React.useRef(null);
  const password = React.useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();

    if(email.current.value.trim()===""){
      setError("Email required");
      setTimeout(unsetError, 100);
      return;
    }
    if(password.current.value.length<6){
      setError("Invalid Credentials");
      setTimeout(unsetError, 100);
      return;
    }

    const data = {
      email: email.current.value,
      password: password.current.value,
    }

    try{
      await login(data);
      authCompleted();
    } catch(err){
      setError(err.message);
      setTimeout(unsetError, 100);
      return;
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form key={"haha"} className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={email}
            
          />
          <TextField
            inputRef={password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapDispatchToProps = {
  login,
  setError,
  unsetError
}

export default connect(null, mapDispatchToProps)(Login);