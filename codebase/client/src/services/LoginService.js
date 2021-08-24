import fetchError from '../helper/customException';
import axios from 'axios'


const config = {
    headers:  {
        'Content-Type': 'application/json'
    }
}

export const login = async data => {
    try {
        const response = await axios.post("/auth", JSON.stringify(data), config);
        return response.data;
    } catch (err) {
        console.log(err);
        if (typeof err.text === 'function') {
            let errorMessage = await err.text();
            throw new fetchError(err.status, errorMessage);
        } else {
            throw new Error(err);
        }
    }
}

export const logout = async () => {
    try {
        localStorage.removeItem("token");
    } catch (error) {
        
    }
}

export const signup = async data => {
    try {
        const response = await axios.post("/user", JSON.stringify(data), config);
        return response.data;
    } catch (error) {
        
    }
}