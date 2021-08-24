import axios from "axios"

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
}

export const addArticle = async data => {
    try {
        const response = await axios.post("/article", JSON.stringify(data), config);
        return response.data;
    } catch (error) {
        
    }
}

export const fetchArticles = async data => {
    try {
        const response = await axios.get("/article");
        return response.data;
    } catch (error) {
        
    }
}