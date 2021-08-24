import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import config from './environments/main';
import axios from 'axios';
import './App.css';

import Login from './components/login/Login';
import Home from './components/home/Home';
import ErrorBoundary from './helper/Error';
import setAuthToken from './services/setAuthToken';
import { fetchCurrentUser } from './services/UserService';
import Navbar from './components/navbar/Navbar';
import SignUp from './components/signup/SignUp';


axios.defaults.baseURL = config.baseUrl;

export default function App() {

  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=>{
    authStateChanged();
  },[]);

  const authStateChanged = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    setAuthToken(token);
    if(token){
      setIsAuth(true);
      const response = await fetchCurrentUser();
      setCurrentUser(response.data);
    } else {
      setIsAuth(false);
      setCurrentUser(null);
    }
    setLoading(false);
  }


  return (
    <div>
        <BrowserRouter>
          <ErrorBoundary>
            <Navbar currentUser={currentUser} authCompleted={authStateChanged}/>
            <Switch>
                <Route exact path="/"     
                  render={(props) =>  
                    !loading && isAuth ? <Home currentUser={currentUser} {...props}/> 
                    : <Login authCompleted={authStateChanged} {...props}/>}
                />
                <Route exact path="/signup" component={SignUp}/>
            </Switch>
          </ErrorBoundary>
        </BrowserRouter>

    </div>
  )
}
