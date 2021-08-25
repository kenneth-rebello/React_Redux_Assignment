import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import SignUp from './components/signup/SignUp';


import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import { fetchCurrentUser, alreadyLoggedIn } from './redux/actions/authActions';
import config from './environments/main';


axios.defaults.baseURL = config.baseUrl;

const App = ({isAuth, fetchCurrentUser, alreadyLoggedIn, error}) => {

  const [loading, setLoading] = useState(true);

  const authStateChanged = useCallback( async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    alreadyLoggedIn(token);
    if(token){
      fetchCurrentUser();
    }
    setLoading(false);
  }, [alreadyLoggedIn, fetchCurrentUser]);

  useEffect(()=>{
    authStateChanged();
  },[authStateChanged]);


  useEffect(()=>{
    if(error){
      toast.error(error);
    }
  },[error])

  return (
    <div>
      <BrowserRouter>
        <ErrorBoundary isNavBar={true}>
          <Navbar authCompleted={authStateChanged}/>
        </ErrorBoundary>
        <Toaster />
        <Switch>
          <ErrorBoundary>
            <Route exact path="/"     
              render={(props) =>  
                !loading && isAuth ? <Home {...props}/> 
                : <Login authCompleted={authStateChanged} {...props}/>}
            />
            <Route exact path="/signup" render={(props) => 
              <SignUp authCompleted={authStateChanged} {...props}/>}
            />
          </ErrorBoundary>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  isAuth: state.auth.isAuth,
  error: state.error.message
})

const mapDispatchToProps = {
  fetchCurrentUser, 
  alreadyLoggedIn
}

export default connect(mapStateToProps, mapDispatchToProps)(App)