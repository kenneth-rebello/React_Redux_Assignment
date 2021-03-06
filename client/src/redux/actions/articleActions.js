import axios from "axios"
import { ADD_POST, DELETE_POST, FETCH_POSTS, SET_POST, UNSET_POST, UPDATE_POST } from "../types";

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
}

export const addArticle = data => async dispatch => {
    try {
        const response = await axios.post("/article", JSON.stringify(data), config);
        if(response.data.success){
            dispatch({
                type: ADD_POST,
                payload: response.data.data.article
            })
        } else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
        
    } catch (error) {
        throw Error(error.message);
    }
}

export const fetchArticles = data => async dispatch => {
    try {
        const response = await axios.get("/article");
        if(response.data.success){
            dispatch({
                type: FETCH_POSTS,
                payload: response.data.data
            })
        }
        else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
    } catch (error) {
        console.log(error.message);
    }
}

export const editPost = (article) => async dispatch => {
    dispatch({
        type: SET_POST,
        payload: article
    })
}
export const unsetPost = () => dispatch => {
    dispatch({
        type: UNSET_POST
    })
}

export const updateArticle = article => async dispatch => {
    try {
        const response = await axios.put(`/article/${article.id}`, JSON.stringify(article), config);
        if(response.data.success){
            dispatch({
                type: UPDATE_POST,
                payload: response.data.data.new
            });
        }else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
    } catch (error) {
        throw Error(error.message);
    }
}

export const deleteArticle = id => async dispatch => {

    try {
        const response = await axios.delete(`/article/${id}`);
        if(response.data.success){
            dispatch({
                type: DELETE_POST,
                payload: id
            })
        } else if(response.data.error){
            throw Error(response.data.error[0].msg);
        }
    } catch (error) {
        throw Error(error.message);
    }
}