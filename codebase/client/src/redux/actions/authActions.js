import axios from 'axios';
import setAuthToken from '../../helpers/setAuthToken';
import { FETCH_USER, LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from '../types';
 
const config = {
    headers:  {
        'Content-Type': 'application/json'
    }
}

export const login = data => async dispatch => {
    try {
        const response = await axios.post("/auth", JSON.stringify(data), config);
        console.log(response);
        if(response.data.success && response.data.data.token){
            const token = response.data.data.token;
            setAuthToken(token);
            if(token){
                localStorage.setItem("token", token);
                dispatch({
                    type: LOGIN_SUCCESSFUL
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}

export const logout = () => dispatch => {
    try {
        localStorage.removeItem("token");
        setAuthToken(null);
        dispatch({
            type: LOGOUT_SUCCESSFUL
        })
    } catch (error) {
        console.log(error)
    }
}

export const signup = (data) => async dispatch => {
    try {
        const response = await axios.post("/user", data, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
        if(response.data.success){
            const credentials = {
                email: data.email,
                password: data.password
            }
            await dispatch(login(credentials));
        }
        return response.data.success;
    } catch (error) {
        
    }
}


export const fetchCurrentUser = () => async dispatch => {
    try {
        const response = await axios.get("/user");
        dispatch({
            type: FETCH_USER,
            payload: response.data.data
        }); 
    } catch (error) {
        
    }
}

export const alreadyLoggedIn = (token) => dispatch => {
    setAuthToken(token);
    if(token){
        localStorage.setItem("token", token);
        dispatch({
            type: LOGIN_SUCCESSFUL
        })
    }
}