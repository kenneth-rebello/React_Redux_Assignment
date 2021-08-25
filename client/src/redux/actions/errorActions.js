import { SET_ERROR, UNSET_ERROR } from "../types"

export const setError = (message) => dispatch => {
    dispatch({
        type: SET_ERROR,
        payload: message
    })
}

export const unsetError = () => dispatch => {
    dispatch({
        type: UNSET_ERROR
    })
}