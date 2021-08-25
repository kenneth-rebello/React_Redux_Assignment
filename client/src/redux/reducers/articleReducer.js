import { ADD_POST, DELETE_POST, FETCH_POSTS, SET_POST, UNSET_POST, UPDATE_POST } from '../types';

const initialState = {
    all: [],
    selectedArticle: null
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
        case SET_POST:{
            return {
                ...state,
                selectedArticle: action.payload
            }
        }
        case UNSET_POST:{
            return {
                ...state,
                selectedArticle: null
            }
        }
        case UPDATE_POST:{
            return {
                ...state,
                selectedArticle: null,
                all: [action.payload, ...state.all.filter(article => article?.id!==action.payload.id)]
            }
        }
        case DELETE_POST: {
            return {
                ...state,
                all: [...state.all.filter(article => article.id!==action.payload)]
            }
        }
        default:
            return state;
    }
}