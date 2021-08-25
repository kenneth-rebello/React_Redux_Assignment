const fs = require("fs");
const uuid = require('uuid');
const { getPasswordHash } = require("./auth");


const DATA_STORE = "./data/users.json";

// Service returns json message and status code in an array
const registerUser = async (userData) => {

    const data = await readFromDataStore();
    if(!data){
        return {
            response:{
                error: [{ msg: "There was an error connecting to the data store"}],
                success: false
            },
            status: 500
        }
    }
    //Hash password
    userData.password = await getPasswordHash(userData.password);

    //Generate user id
    userData.id = uuid.v4();
    
    if(await getUserByEmail(userData.email, data.users)){
        return {
            response: {
                error: [{ msg: "This email address is already in use"}],
                success: false
            },
            status: 400
        }
    }

    //Write new user to the file
    data.users.push(userData);
    
    if(writeToDataStore(JSON.stringify(data))){
        return {
            response:{
                data: {
                    msg:  `User registered with ID ${userData.id}`,
                    id: userData.id,
                },
                success: true
            },
            status: 200
        }
    } 
    else{
        return {
            response: {
                error: [{ msg: "There was an error connecting to the data store"}],
                success: false
            },
            status: 500
        }
    }
}

const getAllUsers = async() => {
    const data = await readFromDataStore();
    result = data.users.map(user => ({
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "profile_picture": user.profile_picture,
        "id": user.id
    }));
    return {
        response:{
            data: result,
            success: true
        }, 
        status: 200
    };
}

const getUserByEmail = async (userEmail, allUsers = []) => {
    if(allUsers.length<1){
        const data = await readFromDataStore();
        allUsers = data.users;
    }
    userFound = allUsers.filter(user => user.email == userEmail);
    if(userFound.length>0) {
        return userFound[0];
    }
    else {
        return null;
    }
}

const getUserById = async (userId, allUsers=[]) => {
    if(allUsers.length<1){
        const data = await readFromDataStore();
        allUsers = data.users;
    }
    userFound = allUsers.filter(user => user.id == userId);
    if(userFound.length>0) {
        return userFound[0];
    }
    else {
        return null;
    }
}

const updateUser = async(updatedUser) => {
    try{
        let res = await getAllUsers();
        users = res.response.data.filter(user => user.id !== updatedUser.id);
        users.push(updatedUser);
        const success = writeToDataStore(JSON.stringify({"users": users}))
        return success;
    }
    catch(e) {
        return false;
    }
}

const sanitizeUser = (user) => {
    return {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "profile_picture": user.profile_picture,
        "id": user.id
    }
}

const readFromDataStore = async() => {
    try {
        data = fs.readFileSync(DATA_STORE, 'utf8'); 
        data = JSON.parse(data);
        if(!data) return {users:[]};
        if(!data.users) return {users:[]};
        return data;
    } catch (error) {
        return {users:[]};
    }
}

const writeToDataStore = async(data) => {
    try{
        fs.writeFile(DATA_STORE, data, 'utf8', ()=>{});  
    }
    catch{
        return false;
    }
    return true;
}

module.exports = {
    registerUser,
    updateUser,
    getAllUsers,
    getUserByEmail,
    getUserById,
    sanitizeUser
}