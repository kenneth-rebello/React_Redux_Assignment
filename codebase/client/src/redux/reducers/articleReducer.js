import { ADD_POST, FETCH_POSTS } from '../types';

const initialState = {
    all: []
}

export default function(state=initialState, action){
    switch(action.type){
        case FETCH_POSTS: {
            return {
                ...state,
                all: action.payload
            }
        }
        case ADD_POST: {
            return {
                ...state,
                all: [action.payload, ...state.all]
            }
        }
        default:
            return state;
    }
}