import axios from "axios"
import { ADD_POST, FETCH_POSTS } from "../types";

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
}

export const addArticle = data => async dispatch => {
    try {
        const response = await axios.post("/article", JSON.stringify(data), config);
        dispatch({
            type: ADD_POST,
            payload: response.data.data.article
        })
    } catch (error) {
        
    }
}

export const fetchArticles = data => async dispatch => {
    try {
        const response = await axios.get("/article");
        dispatch({
            type: FETCH_POSTS,
            payload: response.data.data
        })
    } catch (error) {
        
    }
}