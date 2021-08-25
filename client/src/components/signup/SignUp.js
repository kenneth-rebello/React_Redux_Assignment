import React from "react";
// import { Redirect } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { signup } from '../../redux/actions/authActions';
import { setError, unsetError } from '../../redux/actions/errorActions';
import { connect } from "react-redux";
import { Input } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  label:{
    color: "darkblue",
    marginTop: "10px",
    fontSize: "14px",
    fontFamily:"Calibri"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



const SignUp = ({signup, setError, unsetError, authCompleted, history}) => {
  const classes = useStyles();

  const email = React.useRef(null);
  const password = React.useRef(null);
  const confirm = React.useRef(null);
  const name = React.useRef(null);
  const phone = React.useRef(null);
  const [file, setFile] = React.useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    if(email.current.value.trim()===""){
      setError("Email required");
      setTimeout(unsetError, 100);
      return;
    }
    if(name.current.value.trim()===""){
      setError("Name required");
      setTimeout(unsetError, 100);
      return;
    }
    if(password.current.value !== confirm.current.value){
      setError("Passwords entered do not match");
      setTimeout(unsetError, 100);
      return;
    }

    const data = new FormData();
    data.append("email", email.current.value);
    data.append("password", password.current.value);
    data.append("name", name.current.value);
    if(phone.current.value.trim()!==""){
      data.append("phone", phone.current.value);
    }
    if(file){
      data.append("profile_picture", file);
    }
    
    try{
      const success = await signup(data); 
      if(success){
        authCompleted();
        history.push("/");
      }
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
          Sign-Up
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
          <TextField
            inputRef={confirm}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm"
            label="Confirm Password"
            type="password"
            id="confirm"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            inputRef={name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            inputRef={phone}
          />
          <p className={classes.label}>Profile Picture</p>
          <Input
            type="file"
            onChange={e=>setFile(e.target.files[0])}
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>

          <Grid container>
            <Grid item>
              <Link to="/" variant="body2">
                {"Have an account already? Login"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapDispatchToProps = {
  signup,
  setError,
  unsetError
}

export default connect(null, mapDispatchToProps)(SignUp);