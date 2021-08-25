const fs = require("fs");
const uuid = require("uuid");

const DATA_STORE = "./data/articles.json";

const postArticle = async(article) => {
    const data = readFromDataStore();
    if(!data){
        return {
            response: {
                error: [{ msg: "There was an error connecting to the data store"}],
                success: false
            },
            status: 500
        }
    }
    article.id = uuid.v4();
    data.articles.push(article);

    if(writeToDataStore(data)){
        return {
            response: {
                data:{
                    msg:  `Article posted with ID ${article.id}`,
                    id: article.id,
                    article: article
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

const getAllArticles = async() =>{
    const data = readFromDataStore();
    if(!data){
        return {
            response: {
                error: [{ msg: "There was an error connecting to the data store"}],
                success: false
            },
            status: 500
        }
    }
    result = data.articles.map(article => ({
        "title": article.title,
        "content": article.content,
        "created_at": article.created_at,
        "author_id": article.author_id,
        "author_name": article.author_name,
        "id": article.id
    }));
    return {
        response: {
            data: result,
            success: true
        },
        status: 200
    };
}

const getArticleById = async(id) => {
    const data = readFromDataStore();
    if(!data){
        return {
            response: {
                error: [{ msg: "There was an error connecting to the data store"}],
                success: false
            },
            status: 500
        }
    }
    const result = await data.articles.find(article => article.id==id);
    if(!result){
        return {
            response: {
                error: [{ msg: "The article you are looking for does not exist"}],
                success: false
            },
            status: 404
        }
    }
    return {
        response: {
            data: result,
            success: true,
        },
        status: 200
    };
}

const updateArticle = async(updatedArticle) => {
    try{
        let res = await getAllArticles();
        articles = res.response.data.filter(user => user.id !== updatedArticle.id);
        articles.push(updatedArticle);
        const success = writeToDataStore({"articles": articles})
        return success;
    }
    catch(e) {
        return false;
    }
}

const removeArticle = async(id) => {
    try{
        const data = readFromDataStore();
        if(!data){
            return false;
        }
        const remaining = data.articles.filter(article => article.id != id);
        writeToDataStore({
            articles: remaining
        });
        return true;
    }
    catch(e){
        console.log(e.message)
        return false;
    }
}

const readFromDataStore = () => {
    try {
        data = fs.readFileSync(DATA_STORE, 'utf8');   
        data = JSON.parse(data);
        if(!data) return {articles:[]};
        if(!data.articles) return {articles:[]};
        return data;
    } catch (error) {
        return {articles:[]};
    }
}

const writeToDataStore = (data) => {
    try{
        data = JSON.stringify(data);
        fs.writeFile(DATA_STORE, data, 'utf8', ()=>{});  
    }
    catch{
        return false;
    }
    return true;
}

module.exports = {
    postArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    removeArticle
}