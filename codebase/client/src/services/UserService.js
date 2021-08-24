import axios from 'axios';

export const fetchCurrentUser = async () =>{
    try {
        const response = await axios.get("/user");
        return response.data;    
    } catch (error) {
        
    }
}