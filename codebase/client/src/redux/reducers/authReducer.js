import { FETCH_USER, LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL } from '../types';

const initialState = {
    currentUser: null,
    isAuth: false
}

export default function(state=initialState, action){
    switch(action.type){
        case LOGIN_SUCCESSFUL: {   
            return {
                ...state,
                isAuth: true
            }
        }
        case LOGOUT_SUCCESSFUL: {
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }
        }
        case FETCH_USER: {
            return {
                ...state,
                currentUser: action.payload
            }
        }
        default:
            return state;
    }
}