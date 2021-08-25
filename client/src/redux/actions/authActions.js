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
        if(response.data.success){
            const token = response.data.data.token;
            setAuthToken(token);
            if(token){
                localStorage.setItem("token", token);
                dispatch({
                    type: LOGIN_SUCCESSFUL
                })
            }
        }else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
        
    } catch (error) {
        throw Error(error.message);
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
        if(response.data.success){
            const credentials = {
                email: data.get("email"),
                password: data.get("password")
            }
            await dispatch(login(credentials));
            
        }else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
        return response.data.success;
        
    } catch (error) {
        throw Error(error.message);
    }
}


export const fetchCurrentUser = () => async dispatch => {
    try {
        const response = await axios.get("/user");
        if(response.data.success){
            dispatch({
                type: FETCH_USER,
                payload: response.data.data
            });
        }
        else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
    } catch (error) {
        console.log(error.message);
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