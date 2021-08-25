import { SET_ERROR, UNSET_ERROR } from '../types';

const initialState = {
    message:"",
    type:""
}

export default function(state=initialState, action){
    switch(action.type){
        case SET_ERROR: {
            return {
                message: action.payload
            }
        }
        case UNSET_ERROR:{
            return {
                message: "",
                type: ""
            }
        }
        default:
            return state;
    }
}